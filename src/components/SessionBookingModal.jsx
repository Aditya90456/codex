import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  BookOpen, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const SessionBookingModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [step, setStep] = useState(1); // 1: Form, 2: Confirmation
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [topics, setTopics] = useState({});
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    preferred_date: '',
    preferred_time: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    topics: [],
    experience_level: 'beginner',
    specific_goals: '',
    duration: 60
  });
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState('');

  // Initialize form with user data
  useEffect(() => {
    if (user && isOpen) {
      setFormData(prev => ({
        ...prev,
        user_name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user.emailAddresses?.[0]?.emailAddress || '',
        user_email: user.emailAddresses?.[0]?.emailAddress || '',
        user_id: user.id
      }));
    }
  }, [user, isOpen]);

  // Load available slots and topics when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAvailableSlots();
      loadTopics();
    }
  }, [isOpen]);

  const loadAvailableSlots = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/sessions/availability`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableSlots(data.available_slots);
      }
    } catch (error) {
      console.error('Failed to load available slots:', error);
    }
  };

  const loadTopics = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/sessions/topics`);
      const data = await response.json();
      
      if (data.success) {
        setTopics(data.topics);
      }
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/sessions/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setBookingResult(data);
        setStep(2);
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicToggle = (topic) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Book 1v1 Python Session</h2>
              <p className="text-sm text-gray-400">Get personalized Python coding help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {step === 1 ? (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{error}</span>
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.user_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.user_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Preferred Date *
                  </label>
                  <select
                    required
                    value={formData.preferred_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferred_date: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a date</option>
                    {[...new Set(availableSlots.map(slot => slot.date))].map(date => (
                      <option key={date} value={date}>
                        {formatDate(date)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Preferred Time *
                  </label>
                  <select
                    required
                    value={formData.preferred_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferred_time: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.preferred_date}
                  >
                    <option value="">Select a time</option>
                    {availableSlots
                      .filter(slot => slot.date === formData.preferred_date)
                      .map(slot => (
                        <option key={slot.time} value={slot.time}>
                          {formatTime(slot.time)}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Session Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={60}>60 minutes (Recommended)</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Experience Level
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['beginner', 'intermediate', 'advanced', 'expert'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, experience_level: level }))}
                    className={`p-3 rounded-lg border transition-colors capitalize ${
                      formData.experience_level === level
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : 'bg-slate-700 border-slate-600 text-gray-400 hover:bg-slate-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            {topics[formData.experience_level] && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Topics of Interest
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {topics[formData.experience_level].map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleTopicToggle(topic)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        formData.topics.includes(topic)
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-slate-700 border-slate-600 text-gray-400 hover:bg-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {formData.topics.includes(topic) && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span className="text-sm">{topic}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specific Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Specific Goals (Optional)
              </h3>
              
              <textarea
                value={formData.specific_goals}
                onChange={(e) => setFormData(prev => ({ ...prev, specific_goals: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Tell us what you'd like to focus on during the session..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Book Session'
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation */
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Session Booked!</h3>
              <p className="text-gray-400">
                Your 1v1 Python session has been successfully booked.
              </p>
            </div>

            <div className="bg-slate-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Session ID:</span>
                <span className="font-mono text-blue-400">{bookingResult?.session_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Date & Time:</span>
                <span className="text-white">
                  {formatDate(formData.preferred_date)} at {formatTime(formData.preferred_time)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{formData.duration} minutes</span>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-300 space-y-1 text-left">
                {bookingResult?.next_steps?.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Continue Coding
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionBookingModal;