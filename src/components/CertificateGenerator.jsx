import { useState, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Award, 
  Download, 
  Share2, 
  CheckCircle, 
  Trophy,
  Star,
  Sparkles,
  Calendar,
  User,
  X
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const CertificateGenerator = ({ certificateData, onClose }) => {
  const { user } = useUser();
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const certificateRef = useRef(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${certificateData.title.replace(/\s+/g, '-')}-Certificate.pdf`);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate');
    } finally {
      setDownloading(false);
    }
  };

  const shareCertificate = async () => {
    setSharing(true);
    try {
      // Save certificate to backend and get shareable link
      const response = await fetch(`${API_URL}/api/certificates/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          certificateData
        })
      });
      
      const data = await response.json();
      if (data.success) {
        const shareUrl = `${window.location.origin}/certificate/${data.certificateId}`;
        
        if (navigator.share) {
          await navigator.share({
            title: `${certificateData.title} Certificate`,
            text: `I just earned a certificate in ${certificateData.title}!`,
            url: shareUrl
          });
        } else {
          navigator.clipboard.writeText(shareUrl);
          alert('Certificate link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
      alert('Failed to share certificate');
    } finally {
      setSharing(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="relative max-w-6xl w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Certificate */}
        <div 
          ref={certificateRef}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{ aspectRatio: '1.414/1' }}
        >
          {/* Border Design */}
          <div className="relative h-full p-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Decorative Border */}
            <div className="absolute inset-8 border-4 border-double border-blue-600/30 rounded-lg"></div>
            <div className="absolute inset-10 border border-purple-400/20 rounded-lg"></div>
            
            {/* Corner Decorations */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-blue-600 rounded-tl-lg"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-blue-600 rounded-tr-lg"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-purple-600 rounded-bl-lg"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-purple-600 rounded-br-lg"></div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-between py-8">
              {/* Header */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Trophy className="w-12 h-12 text-yellow-500" />
                  <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Certificate of Completion
                  </h1>
                  <Trophy className="w-12 h-12 text-yellow-500" />
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <p className="text-lg font-semibold">Excellence in Web Development</p>
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
              </div>

              {/* Main Content */}
              <div className="text-center space-y-6 max-w-3xl">
                <p className="text-xl text-gray-700 font-medium">
                  This is to certify that
                </p>
                
                <h2 className="text-6xl font-bold text-gray-900 border-b-4 border-blue-600 pb-4 inline-block">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username || 'Student'}
                </h2>
                
                <p className="text-xl text-gray-700 font-medium">
                  has successfully completed
                </p>
                
                <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {certificateData.title}
                </h3>
                
                {certificateData.description && (
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {certificateData.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-center gap-8 pt-4">
                  {certificateData.score && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-lg font-semibold text-gray-700">
                        Score: {certificateData.score}%
                      </span>
                    </div>
                  )}
                  {certificateData.completedProjects && (
                    <div className="flex items-center gap-2">
                      <Award className="w-6 h-6 text-blue-600" />
                      <span className="text-lg font-semibold text-gray-700">
                        {certificateData.completedProjects} Projects
                      </span>
                    </div>
                  )}
                  {certificateData.totalPoints && (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                      <span className="text-lg font-semibold text-gray-700">
                        {certificateData.totalPoints} Points
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="w-full">
                <div className="flex items-end justify-between max-w-4xl mx-auto">
                  {/* Date */}
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <p className="text-sm font-medium">Date of Completion</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 border-t-2 border-gray-300 pt-2">
                      {formatDate(certificateData.completedDate || new Date())}
                    </p>
                  </div>

                  {/* Certificate ID */}
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-2">
                      <Award className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Certificate ID: {certificateData.certificateId || 'CERT-' + Date.now()}
                    </p>
                  </div>

                  {/* Signature */}
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-2 text-gray-600">
                      <User className="w-5 h-5" />
                      <p className="text-sm font-medium">Authorized By</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 border-t-2 border-gray-300 pt-2">
                      Platform Director
                    </p>
                  </div>
                </div>

                {/* Verification Link */}
                <div className="text-center mt-6">
                  <p className="text-xs text-gray-500">
                    Verify this certificate at: {window.location.origin}/verify/{certificateData.certificateId || 'CERT-' + Date.now()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={downloadCertificate}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download PDF
              </>
            )}
          </button>

          <button
            onClick={shareCertificate}
            disabled={sharing}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {sharing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent"></div>
                Sharing...
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
