const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

// Simple file-based storage (you can replace with a proper database)
const SESSIONS_FILE = path.join(__dirname, '../data/sessions.json');
const AVAILABILITY_FILE = path.join(__dirname, '../data/availability.json');

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.join(__dirname, '../data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Load sessions from file
const loadSessions = async () => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SESSIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save sessions to file
const saveSessions = async (sessions) => {
  await ensureDataDir();
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
};

// Get available time slots
const getAvailableSlots = () => {
  const slots = [];
  const today = new Date();
  
  // Generate next 14 days
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip weekends
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Available time slots (9 AM to 6 PM)
      const timeSlots = [
        '09:00', '10:00', '11:00', '12:00',
        '14:00', '15:00', '16:00', '17:00', '18:00'
      ];
      
      timeSlots.forEach(time => {
        slots.push({
          date: dateStr,
          time: time,
          datetime: `${dateStr}T${time}:00`,
          dayName: dayName,
          available: true
        });
      });
    }
  }
  
  return slots;
};

// POST /api/sessions/book - Book a new 1v1 Python session
router.post('/book', async (req, res) => {
  try {
    const {
      user_name,
      user_email,
      user_id,
      preferred_date,
      preferred_time,
      timezone = 'UTC',
      topics = [],
      experience_level = 'beginner',
      specific_goals = '',
      duration = 60,
      session_type = 'python_1v1'
    } = req.body;

    // Validate required fields
    if (!user_name || !user_email || !preferred_date || !preferred_time) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: user_name, user_email, preferred_date, preferred_time'
      });
    }

    // Generate session ID
    const sessionId = uuidv4();
    
    // Load existing sessions
    const sessions = await loadSessions();
    
    // Check if slot is already booked
    const isSlotTaken = sessions.some(session => 
      session.preferred_date === preferred_date &&
      session.preferred_time === preferred_time &&
      ['pending', 'confirmed'].includes(session.status)
    );
    
    if (isSlotTaken) {
      return res.status(409).json({
        success: false,
        error: 'This time slot is already booked. Please choose another time.'
      });
    }

    // Create new session
    const newSession = {
      id: sessionId,
      user_name,
      user_email,
      user_id,
      session_type,
      preferred_date,
      preferred_time,
      timezone,
      topics,
      experience_level,
      specific_goals,
      duration,
      status: 'pending',
      created_at: new Date().toISOString(),
      scheduled_at: null,
      meeting_link: null,
      notes: ''
    };

    // Add to sessions
    sessions.push(newSession);
    await saveSessions(sessions);

    // Send confirmation email (placeholder)
    console.log(`📧 Booking confirmation for ${user_email}:`, {
      sessionId,
      preferred_date,
      preferred_time,
      experience_level,
      topics
    });

    res.json({
      success: true,
      session_id: sessionId,
      message: 'Session booking request submitted successfully!',
      session: newSession,
      next_steps: [
        'You will receive a confirmation email shortly',
        'We will contact you within 24 hours to confirm the session',
        'A calendar invite will be sent once confirmed'
      ]
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to book session'
    });
  }
});

// GET /api/sessions/availability - Get available time slots
router.get('/availability', async (req, res) => {
  try {
    const sessions = await loadSessions();
    const allSlots = getAvailableSlots();
    
    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => {
      return !sessions.some(session =>
        session.preferred_date === slot.date &&
        session.preferred_time === slot.time &&
        ['pending', 'confirmed'].includes(session.status)
      );
    });

    res.json({
      success: true,
      available_slots: availableSlots
    });

  } catch (error) {
    console.error('Availability error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get availability'
    });
  }
});

// GET /api/sessions/topics - Get available Python topics
router.get('/topics', (req, res) => {
  const topics = {
    beginner: [
      'Python Basics & Syntax',
      'Variables & Data Types',
      'Control Flow (if/else, loops)',
      'Functions & Modules',
      'Lists, Tuples & Dictionaries',
      'File Handling',
      'Error Handling & Debugging'
    ],
    intermediate: [
      'Object-Oriented Programming',
      'Data Structures & Algorithms',
      'Web Development (Flask/Django)',
      'API Development & REST',
      'Database Integration',
      'Testing & Unit Tests',
      'Package Management & Virtual Environments'
    ],
    advanced: [
      'Advanced Python Concepts',
      'Design Patterns',
      'Performance Optimization',
      'Concurrency & Threading',
      'Machine Learning with Python',
      'DevOps & Deployment',
      'Code Review & Best Practices'
    ],
    specialized: [
      'LeetCode Problem Solving',
      'Technical Interview Preparation',
      'System Design with Python',
      'Data Science & Analytics',
      'Automation & Scripting',
      'Web Scraping',
      'Game Development with Python'
    ]
  };

  res.json({
    success: true,
    topics
  });
});

// GET /api/sessions/my-sessions - Get user's sessions
router.get('/my-sessions', async (req, res) => {
  try {
    const { email, user_id } = req.query;
    
    if (!email && !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Email or user_id required'
      });
    }

    const sessions = await loadSessions();
    
    const userSessions = sessions.filter(session => {
      if (user_id) return session.user_id === user_id;
      return session.user_email === email;
    });

    // Sort by creation date (newest first)
    userSessions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      success: true,
      sessions: userSessions
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sessions'
    });
  }
});

// POST /api/sessions/cancel - Cancel a session
router.post('/cancel', async (req, res) => {
  try {
    const { session_id, reason = 'Cancelled by user' } = req.body;
    
    if (!session_id) {
      return res.status(400).json({
        success: false,
        error: 'Session ID required'
      });
    }

    const sessions = await loadSessions();
    const sessionIndex = sessions.findIndex(s => s.id === session_id);
    
    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Update session status
    sessions[sessionIndex].status = 'cancelled';
    sessions[sessionIndex].notes = reason;
    sessions[sessionIndex].cancelled_at = new Date().toISOString();

    await saveSessions(sessions);

    res.json({
      success: true,
      message: 'Session cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel session'
    });
  }
});

// POST /api/sessions/confirm - Confirm a session (admin only)
router.post('/confirm', async (req, res) => {
  try {
    const { session_id, meeting_link, notes = '' } = req.body;
    
    if (!session_id) {
      return res.status(400).json({
        success: false,
        error: 'Session ID required'
      });
    }

    const sessions = await loadSessions();
    const sessionIndex = sessions.findIndex(s => s.id === session_id);
    
    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Update session
    sessions[sessionIndex].status = 'confirmed';
    sessions[sessionIndex].meeting_link = meeting_link;
    sessions[sessionIndex].notes = notes;
    sessions[sessionIndex].confirmed_at = new Date().toISOString();

    await saveSessions(sessions);

    res.json({
      success: true,
      message: 'Session confirmed successfully',
      session: sessions[sessionIndex]
    });

  } catch (error) {
    console.error('Confirm session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm session'
    });
  }
});

// GET /api/sessions/stats - Get booking statistics
router.get('/stats', async (req, res) => {
  try {
    const sessions = await loadSessions();
    
    const stats = {
      total_sessions: sessions.length,
      pending: sessions.filter(s => s.status === 'pending').length,
      confirmed: sessions.filter(s => s.status === 'confirmed').length,
      completed: sessions.filter(s => s.status === 'completed').length,
      cancelled: sessions.filter(s => s.status === 'cancelled').length,
      by_experience_level: {},
      popular_topics: {},
      upcoming_sessions: sessions.filter(s => 
        s.status === 'confirmed' && 
        new Date(s.preferred_date) >= new Date()
      ).length
    };

    // Group by experience level
    sessions.forEach(session => {
      const level = session.experience_level || 'unknown';
      stats.by_experience_level[level] = (stats.by_experience_level[level] || 0) + 1;
    });

    // Count popular topics
    sessions.forEach(session => {
      if (session.topics && Array.isArray(session.topics)) {
        session.topics.forEach(topic => {
          stats.popular_topics[topic] = (stats.popular_topics[topic] || 0) + 1;
        });
      }
    });

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics'
    });
  }
});

module.exports = router;