#!/usr/bin/env python3
"""
1v1 Python Session Booking System
Handles booking, scheduling, and management of 1-on-1 Python coding sessions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import json
import os
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sqlite3
from typing import Dict, List, Optional

app = Flask(__name__)
CORS(app)

# Database setup
DB_PATH = 'sessions.db'

def init_db():
    """Initialize the sessions database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_name TEXT NOT NULL,
            user_email TEXT NOT NULL,
            user_id TEXT,
            session_type TEXT DEFAULT 'python_1v1',
            preferred_date TEXT NOT NULL,
            preferred_time TEXT NOT NULL,
            timezone TEXT DEFAULT 'UTC',
            topics TEXT,
            experience_level TEXT DEFAULT 'beginner',
            specific_goals TEXT,
            duration INTEGER DEFAULT 60,
            status TEXT DEFAULT 'pending',
            created_at TEXT NOT NULL,
            scheduled_at TEXT,
            meeting_link TEXT,
            notes TEXT
        )
    ''')
    
    # Create availability table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS availability (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            time_slot TEXT NOT NULL,
            is_available BOOLEAN DEFAULT TRUE,
            created_at TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/sessions/book', methods=['POST'])
def book_session():
    """Book a new 1v1 Python session"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_name', 'user_email', 'preferred_date', 'preferred_time']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Generate session ID
        session_id = str(uuid.uuid4())
        
        # Create session record
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO sessions (
                id, user_name, user_email, user_id, session_type,
                preferred_date, preferred_time, timezone, topics,
                experience_level, specific_goals, duration, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            session_id,
            data['user_name'],
            data['user_email'],
            data.get('user_id'),
            data.get('session_type', 'python_1v1'),
            data['preferred_date'],
            data['preferred_time'],
            data.get('timezone', 'UTC'),
            json.dumps(data.get('topics', [])),
            data.get('experience_level', 'beginner'),
            data.get('specific_goals', ''),
            data.get('duration', 60),
            'pending',
            datetime.now().isoformat()
        ))
        
        conn.commit()
        conn.close()
        
        # Send confirmation email (if email service is configured)
        try:
            send_booking_confirmation(data, session_id)
        except Exception as e:
            print(f"Failed to send confirmation email: {e}")
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'message': 'Session booking request submitted successfully!',
            'next_steps': [
                'You will receive a confirmation email shortly',
                'We will contact you within 24 hours to confirm the session',
                'A calendar invite will be sent once confirmed'
            ]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sessions/availability', methods=['GET'])
def get_availability():
    """Get available time slots for booking"""
    try:
        # Get next 14 days
        available_slots = []
        today = datetime.now()
        
        for i in range(14):
            date = today + timedelta(days=i)
            date_str = date.strftime('%Y-%m-%d')
            
            # Skip weekends for now (can be customized)
            if date.weekday() < 5:  # Monday = 0, Friday = 4
                # Available time slots (can be customized)
                time_slots = [
                    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
                ]
                
                for time_slot in time_slots:
                    # Check if slot is already booked
                    conn = get_db_connection()
                    cursor = conn.cursor()
                    cursor.execute('''
                        SELECT COUNT(*) as count FROM sessions 
                        WHERE preferred_date = ? AND preferred_time = ? 
                        AND status IN ('confirmed', 'pending')
                    ''', (date_str, time_slot))
                    
                    result = cursor.fetchone()
                    conn.close()
                    
                    if result['count'] == 0:
                        available_slots.append({
                            'date': date_str,
                            'time': time_slot,
                            'datetime': f"{date_str}T{time_slot}:00",
                            'day_name': date.strftime('%A')
                        })
        
        return jsonify({
            'success': True,
            'available_slots': available_slots
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sessions/topics', methods=['GET'])
def get_session_topics():
    """Get available Python topics for 1v1 sessions"""
    topics = {
        'beginner': [
            'Python Basics & Syntax',
            'Variables & Data Types',
            'Control Flow (if/else, loops)',
            'Functions & Modules',
            'Lists, Tuples & Dictionaries',
            'File Handling',
            'Error Handling & Debugging'
        ],
        'intermediate': [
            'Object-Oriented Programming',
            'Data Structures & Algorithms',
            'Web Development (Flask/Django)',
            'API Development & REST',
            'Database Integration',
            'Testing & Unit Tests',
            'Package Management & Virtual Environments'
        ],
        'advanced': [
            'Advanced Python Concepts',
            'Design Patterns',
            'Performance Optimization',
            'Concurrency & Threading',
            'Machine Learning with Python',
            'DevOps & Deployment',
            'Code Review & Best Practices'
        ],
        'specialized': [
            'LeetCode Problem Solving',
            'Technical Interview Preparation',
            'System Design with Python',
            'Data Science & Analytics',
            'Automation & Scripting',
            'Web Scraping',
            'Game Development with Python'
        ]
    }
    
    return jsonify({
        'success': True,
        'topics': topics
    })

@app.route('/api/sessions/my-sessions', methods=['GET'])
def get_user_sessions():
    """Get sessions for a specific user"""
    try:
        user_email = request.args.get('email')
        user_id = request.args.get('user_id')
        
        if not user_email and not user_id:
            return jsonify({
                'success': False,
                'error': 'Email or user_id required'
            }), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if user_id:
            cursor.execute('''
                SELECT * FROM sessions 
                WHERE user_id = ? 
                ORDER BY created_at DESC
            ''', (user_id,))
        else:
            cursor.execute('''
                SELECT * FROM sessions 
                WHERE user_email = ? 
                ORDER BY created_at DESC
            ''', (user_email,))
        
        sessions = []
        for row in cursor.fetchall():
            session = dict(row)
            if session['topics']:
                session['topics'] = json.loads(session['topics'])
            sessions.append(session)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'sessions': sessions
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sessions/cancel', methods=['POST'])
def cancel_session():
    """Cancel a session"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        
        if not session_id:
            return jsonify({
                'success': False,
                'error': 'Session ID required'
            }), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE sessions 
            SET status = 'cancelled', notes = ? 
            WHERE id = ?
        ''', (data.get('reason', 'Cancelled by user'), session_id))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Session not found'
            }), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Session cancelled successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def send_booking_confirmation(booking_data: Dict, session_id: str):
    """Send booking confirmation email"""
    # This is a placeholder - implement with your email service
    # You can use SendGrid, AWS SES, or SMTP
    
    email_content = f"""
    Hi {booking_data['user_name']},
    
    Thank you for booking a 1v1 Python coding session!
    
    Session Details:
    - Session ID: {session_id}
    - Preferred Date: {booking_data['preferred_date']}
    - Preferred Time: {booking_data['preferred_time']}
    - Experience Level: {booking_data.get('experience_level', 'beginner')}
    - Duration: {booking_data.get('duration', 60)} minutes
    
    What's Next:
    1. We'll review your request and confirm availability
    2. You'll receive a calendar invite within 24 hours
    3. We'll send you a preparation guide before the session
    
    If you have any questions, please reply to this email.
    
    Best regards,
    Python Coding Team
    """
    
    print(f"Booking confirmation for {booking_data['user_email']}: {email_content}")

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)