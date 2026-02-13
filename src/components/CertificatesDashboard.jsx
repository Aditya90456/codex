import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Award, 
  Trophy, 
  Star, 
  Calendar,
  Download,
  Share2,
  Eye,
  CheckCircle,
  Lock,
  TrendingUp
} from 'lucide-react';
import CertificateGenerator from './CertificateGenerator';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const CertificatesDashboard = () => {
  const { user } = useUser();
  const [certificates, setCertificates] = useState([]);
  const [availableCertificates, setAvailableCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    if (user) {
      loadCertificates();
      loadAvailableCertificates();
    }
  }, [user]);

  const loadCertificates = async () => {
    try {
      const response = await fetch(`${API_URL}/api/certificates/user/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setCertificates(data.certificates);
      }
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableCertificates = async () => {
    try {
      const response = await fetch(`${API_URL}/api/certificates/available/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setAvailableCertificates(data.available);
      }
    } catch (error) {
      console.error('Error loading available certificates:', error);
    }
  };

  const generateCertificate = (certData) => {
    setSelectedCertificate(certData);
    setShowGenerator(true);
  };

  const getCertificateIcon = (type) => {
    switch (type) {
      case 'web-development':
        return '🌐';
      case 'dsa':
        return '🧮';
      case 'full-stack':
        return '💻';
      case 'frontend':
        return '🎨';
      case 'backend':
        return '⚙️';
      default:
        return '🏆';
    }
  };

  const getCertificateColor = (type) => {
    switch (type) {
      case 'web-development':
        return 'from-blue-600 to-cyan-600';
      case 'dsa':
        return 'from-purple-600 to-pink-600';
      case 'full-stack':
        return 'from-green-600 to-emerald-600';
      case 'frontend':
        return 'from-orange-600 to-red-600';
      case 'backend':
        return 'from-gray-600 to-gray-800';
      default:
        return 'from-blue-600 to-purple-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                My Certificates
              </h1>
              <p className="text-gray-400">
                Showcase your achievements and skills
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="w-8 h-8" />
                <span className="text-3xl font-bold">{certificates.length}</span>
              </div>
              <p className="text-sm opacity-90">Earned Certificates</p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8" />
                <span className="text-3xl font-bold">{availableCertificates.length}</span>
              </div>
              <p className="text-sm opacity-90">Available to Earn</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8" />
                <span className="text-3xl font-bold">
                  {certificates.length + availableCertificates.length > 0 
                    ? Math.round((certificates.length / (certificates.length + availableCertificates.length)) * 100)
                    : 0}%
                </span>
              </div>
              <p className="text-sm opacity-90">Completion Rate</p>
            </div>
          </div>
        </div>

        {/* Earned Certificates */}
        {certificates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Earned Certificates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20"
                >
                  <div className={`h-2 bg-gradient-to-r ${getCertificateColor(cert.type)}`} />
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{getCertificateIcon(cert.type)}</span>
                      <div className="bg-green-500 rounded-full p-2">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">
                      {cert.title}
                    </h3>
                    
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {cert.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(cert.earnedDate).toLocaleDateString()}
                      </div>
                      {cert.score && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          {cert.score}%
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => generateCertificate(cert)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Certificates */}
        {availableCertificates.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-gray-400" />
              Available to Earn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-gray-600 transition-all duration-300"
                >
                  <div className={`h-2 bg-gradient-to-r ${getCertificateColor(cert.type)} opacity-50`} />
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl opacity-50">{getCertificateIcon(cert.type)}</span>
                      <div className="bg-gray-700 rounded-full p-2">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-gray-300">
                      {cert.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {cert.description}
                    </p>

                    {/* Requirements */}
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-gray-400 font-semibold">Requirements:</p>
                      {cert.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          {req.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                          )}
                          <span className={req.completed ? 'text-gray-300' : 'text-gray-500'}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-gray-300 font-semibold">{cert.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getCertificateColor(cert.type)} transition-all duration-500`}
                          style={{ width: `${cert.progress}%` }}
                        />
                      </div>
                    </div>

                    <button
                      className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {certificates.length === 0 && availableCertificates.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Certificates Yet</h3>
            <p className="text-gray-400 mb-6">
              Complete assignments and courses to earn certificates
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all">
              Start Learning
            </button>
          </div>
        )}
      </div>

      {/* Certificate Generator Modal */}
      {showGenerator && selectedCertificate && (
        <CertificateGenerator
          certificateData={selectedCertificate}
          onClose={() => {
            setShowGenerator(false);
            setSelectedCertificate(null);
          }}
        />
      )}
    </div>
  );
};

export default CertificatesDashboard;
