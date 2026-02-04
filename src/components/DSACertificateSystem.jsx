import { useState, useEffect } from 'react';
import { Award, Download, Share2, CheckCircle, Trophy, Target, Calendar } from 'lucide-react';
import { dsaProblems } from '../data/dsaProblems';

const DSACertificateSystem = ({ userId = 'user', userName = 'Coding Enthusiast' }) => {
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [certificates, setCertificates] = useState([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001';

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`dsa_progress_${userId}`);
    if (saved) {
      setCompletedProblems(new Set(JSON.parse(saved)));
    }

    const savedCerts = localStorage.getItem(`dsa_certificates_${userId}`);
    if (savedCerts) {
      setCertificates(JSON.parse(savedCerts));
    }
  }, [userId]);

  // Save progress to localStorage
  const saveProgress = (newCompleted) => {
    localStorage.setItem(`dsa_progress_${userId}`, JSON.stringify([...newCompleted]));
    setCompletedProblems(newCompleted);
  };

  // Mark problem as completed
  const markCompleted = async (problemId, language = 'JavaScript', timeTaken = null) => {
    const newCompleted = new Set(completedProblems);
    newCompleted.add(problemId);
    saveProgress(newCompleted);

    // Check for milestone achievements
    checkMilestones(newCompleted, language, timeTaken);
  };

  // Check for certificate milestones
  const checkMilestones = async (completed, language, timeTaken) => {
    const completedCount = completed.size;
    const milestones = [
      { count: 10, name: 'DSA Beginner', description: 'Completed first 10 problems' },
      { count: 25, name: 'Problem Solver', description: 'Solved 25 DSA problems' },
      { count: 50, name: 'Algorithm Expert', description: 'Mastered 50 algorithms' },
      { count: 100, name: 'DSA Master', description: 'Conquered 100 challenges' },
      { count: 150, name: 'DSA Grandmaster', description: 'Completed all 150 problems!' }
    ];

    // Check category-specific milestones
    const categories = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming', 'Graphs'];
    
    for (const category of categories) {
      const categoryProblems = dsaProblems.filter(p => p.category === category);
      const completedInCategory = categoryProblems.filter(p => completed.has(p.id)).length;
      
      if (completedInCategory === categoryProblems.length) {
        // Completed entire category
        await generateCertificate({
          type: 'category',
          name: `${category} Master`,
          description: `Completed all ${categoryProblems.length} ${category} problems`,
          language,
          timeTaken
        });
      }
    }

    // Check overall milestones
    for (const milestone of milestones) {
      if (completedCount === milestone.count) {
        await generateCertificate({
          type: 'milestone',
          name: milestone.name,
          description: milestone.description,
          language,
          timeTaken,
          problemsCompleted: completedCount
        });
        break;
      }
    }
  };

  // Generate certificate
  const generateCertificate = async (achievement) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE}/api/certificates/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          challengeType: 'dsa',
          challengeName: achievement.name,
          completionTime: achievement.timeTaken,
          score: 100,
          language: achievement.language,
          difficulty: achievement.type === 'milestone' ? 'Expert' : 'Master'
        })
      });

      const data = await response.json();

      if (data.success) {
        const newCert = {
          ...data.certificate,
          achievement,
          generatedAt: new Date().toISOString()
        };

        const updatedCerts = [...certificates, newCert];
        setCertificates(updatedCerts);
        localStorage.setItem(`dsa_certificates_${userId}`, JSON.stringify(updatedCerts));

        setCurrentCertificate(newCert);
        setShowCertificateModal(true);
      }
    } catch (error) {
      console.error('Certificate generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download certificate
  const downloadCertificate = (certificate) => {
    window.open(`${API_BASE}/api/certificates/download/${certificate.id}`, '_blank');
  };

  // Share certificate
  const shareCertificate = (certificate) => {
    const shareText = `🎉 I just earned the "${certificate.challengeName}" certificate for completing DSA challenges! 💪 #DSA #Coding #Achievement`;
    const shareUrl = `${window.location.origin}/verify/${certificate.verificationCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'DSA Certificate Achievement',
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n\nVerify: ${shareUrl}`);
      alert('Certificate link copied to clipboard!');
    }
  };

  // Calculate progress stats
  const getProgressStats = () => {
    const total = dsaProblems.length;
    const completed = completedProblems.size;
    const percentage = Math.round((completed / total) * 100);

    const categoryStats = {};
    const categories = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming', 'Graphs', 'Stack'];
    
    categories.forEach(category => {
      const categoryProblems = dsaProblems.filter(p => p.category === category);
      const completedInCategory = categoryProblems.filter(p => completedProblems.has(p.id)).length;
      categoryStats[category] = {
        completed: completedInCategory,
        total: categoryProblems.length,
        percentage: Math.round((completedInCategory / categoryProblems.length) * 100)
      };
    });

    return { total, completed, percentage, categoryStats };
  };

  const stats = getProgressStats();

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <div>
          <h2 className="text-2xl font-bold text-white">DSA Progress & Certificates</h2>
          <p className="text-gray-400">Track your journey through 150 DSA problems</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">Overall Progress</span>
          <span className="text-green-400 font-bold">{stats.completed}/{stats.total} ({stats.percentage}%)</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* Category Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(stats.categoryStats).map(([category, stat]) => (
          <div key={category} className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{category}</span>
              <span className="text-sm text-gray-400">{stat.completed}/{stat.total}</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
            {stat.completed === stat.total && (
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-400">Category Mastered!</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Certificates */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          Your Certificates ({certificates.length})
        </h3>
        
        {certificates.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Complete problems to earn certificates!</p>
            <p className="text-sm">Milestones: 10, 25, 50, 100, 150 problems</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white">{cert.challengeName}</h4>
                    <p className="text-sm text-gray-400">{cert.achievement?.description}</p>
                  </div>
                  <Award className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(cert.completedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{cert.language}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadCertificate(cert)}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => shareCertificate(cert)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Milestones */}
      <div className="bg-slate-700 rounded-lg p-4">
        <h4 className="font-bold text-white mb-3">Next Milestones</h4>
        <div className="space-y-2">
          {[10, 25, 50, 100, 150].map(milestone => {
            const isCompleted = stats.completed >= milestone;
            const isNext = stats.completed < milestone;
            
            if (isCompleted && milestone !== 150) return null;
            
            return (
              <div key={milestone} className={`flex items-center justify-between p-2 rounded ${
                isCompleted ? 'bg-green-600/20 text-green-400' : 
                isNext ? 'bg-blue-600/20 text-blue-400' : 'text-gray-500'
              }`}>
                <span>{milestone} Problems</span>
                <span className="text-sm">
                  {isCompleted ? '✅ Completed' : `${milestone - stats.completed} to go`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && currentCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">🎉 Congratulations!</h3>
              <p className="text-gray-400 mb-4">You've earned a new certificate!</p>
              
              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-white text-lg">{currentCertificate.challengeName}</h4>
                <p className="text-gray-400 text-sm">{currentCertificate.achievement?.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Verification: {currentCertificate.verificationCode}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => downloadCertificate(currentCertificate)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Download Certificate
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Button (for demo) */}
      <div className="mt-6 p-4 bg-slate-700 rounded-lg">
        <h4 className="text-white font-bold mb-2">Test Certificate System</h4>
        <p className="text-gray-400 text-sm mb-3">Click to simulate completing a problem:</p>
        <button
          onClick={() => markCompleted(Math.floor(Math.random() * 150) + 1, 'JavaScript', '5 minutes')}
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Complete Random Problem'}
        </button>
      </div>
    </div>
  );
};

export default DSACertificateSystem;