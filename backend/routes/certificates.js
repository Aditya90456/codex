const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

// Data directory
const DATA_DIR = path.join(__dirname, '../data');
const CERTIFICATES_FILE = path.join(DATA_DIR, 'certificates.json');
const USER_PROGRESS_FILE = path.join(DATA_DIR, 'user-progress.json');

// In-memory storage for certificates (in production, use a database)
let certificates = [];
let userProgress = {};

// Load data from files
async function loadData() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    try {
      const certData = await fs.readFile(CERTIFICATES_FILE, 'utf8');
      certificates = JSON.parse(certData);
    } catch (err) {
      certificates = [];
    }
    
    try {
      const progressData = await fs.readFile(USER_PROGRESS_FILE, 'utf8');
      userProgress = JSON.parse(progressData);
    } catch (err) {
      userProgress = {};
    }
  } catch (error) {
    console.error('Error loading certificate data:', error);
  }
}

// Save data to files
async function saveData() {
  try {
    await fs.writeFile(CERTIFICATES_FILE, JSON.stringify(certificates, null, 2));
    await fs.writeFile(USER_PROGRESS_FILE, JSON.stringify(userProgress, null, 2));
  } catch (error) {
    console.error('Error saving certificate data:', error);
  }
}

// Initialize data
loadData();

// Generate certificate
router.post('/generate', async (req, res) => {
  try {
    const { 
      userId,
      userName, 
      userEmail, 
      title,
      description,
      type,
      challengeType, 
      challengeName, 
      completionTime, 
      score,
      completedProjects,
      totalPoints,
      language,
      difficulty 
    } = req.body;

    if (!userId || !title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, title'
      });
    }

    const certificateId = 'CERT-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const certificate = {
      id: certificateId,
      userId,
      userName,
      userEmail,
      title,
      description,
      type: type || challengeType || 'web-development',
      challengeName,
      completionTime,
      score: score || 100,
      completedProjects,
      totalPoints,
      language: language || 'JavaScript',
      difficulty: difficulty || 'Medium',
      completedDate: new Date().toISOString(),
      earnedDate: new Date().toISOString(),
      certificateId,
      verificationCode: Math.random().toString(36).substring(2, 15).toUpperCase()
    };

    certificates.push(certificate);

    // Update user progress
    if (!userProgress[userId]) {
      userProgress[userId] = {
        totalChallenges: 0,
        challengesByType: {},
        certificates: []
      };
    }

    userProgress[userId].totalChallenges++;
    userProgress[userId].challengesByType[certificate.type] = 
      (userProgress[userId].challengesByType[certificate.type] || 0) + 1;
    userProgress[userId].certificates.push(certificateId);

    await saveData();

    res.json({
      success: true,
      certificate,
      certificateId,
      downloadUrl: `/api/certificates/download/${certificateId}`,
      verifyUrl: `/api/certificates/verify/${certificate.verificationCode}`
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get certificate by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const certificate = certificates.find(cert => cert.id === id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found'
      });
    }

    res.json({
      success: true,
      certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Verify certificate
router.get('/verify/:code', (req, res) => {
  try {
    const { code } = req.params;
    const certificate = certificates.find(cert => cert.verificationCode === code.toUpperCase());

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: 'Invalid verification code'
      });
    }

    res.json({
      success: true,
      valid: true,
      certificate: {
        userName: certificate.userName,
        challengeName: certificate.challengeName,
        challengeType: certificate.challengeType,
        completedAt: certificate.completedAt,
        score: certificate.score,
        language: certificate.language,
        difficulty: certificate.difficulty
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Download certificate (HTML format)
router.get('/download/:id', (req, res) => {
  try {
    const { id } = req.params;
    const certificate = certificates.find(cert => cert.id === id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found'
      });
    }

    const html = generateCertificateHTML(certificate);
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificate.userName}-${certificate.challengeName}.html"`);
    res.send(html);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user certificates (Clerk userId)
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all certificates for this user
    const userCertificates = certificates.filter(cert => cert.userId === userId);

    res.json({
      success: true,
      certificates: userCertificates,
      totalEarned: userCertificates.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get available certificates for user
router.get('/available/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    // Mock available certificates - in production, calculate based on user progress
    const available = [
      {
        id: 'web-dev-bootcamp',
        title: 'Web Development Bootcamp',
        description: 'Complete 10+ real-world web development projects',
        type: 'web-development',
        progress: 60,
        requirements: [
          { text: 'Complete 10 assignments', completed: true },
          { text: 'Score 70%+ average', completed: true },
          { text: 'Build 5 projects', completed: false }
        ]
      },
      {
        id: 'dsa-mastery',
        title: 'DSA Mastery',
        description: 'Master data structures and algorithms',
        type: 'dsa',
        progress: 40,
        requirements: [
          { text: 'Solve 100+ problems', completed: false },
          { text: 'Cover all patterns', completed: false },
          { text: 'Score 80%+ average', completed: true }
        ]
      },
      {
        id: 'full-stack-dev',
        title: 'Full Stack Developer',
        description: 'Build complete full-stack applications',
        type: 'full-stack',
        progress: 30,
        requirements: [
          { text: 'Complete frontend track', completed: true },
          { text: 'Complete backend track', completed: false },
          { text: 'Build 3 full-stack projects', completed: false }
        ]
      }
    ];

    res.json({
      success: true,
      available
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Share certificate
router.post('/share', async (req, res) => {
  try {
    const { userId, certificateData } = req.body;

    if (!userId || !certificateData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Generate shareable certificate if not exists
    let certificate = certificates.find(c => 
      c.userId === userId && c.title === certificateData.title
    );

    if (!certificate) {
      const certificateId = 'CERT-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      certificate = {
        ...certificateData,
        id: certificateId,
        userId,
        certificateId,
        earnedDate: new Date().toISOString()
      };
      certificates.push(certificate);
      await saveData();
    }

    res.json({
      success: true,
      certificateId: certificate.certificateId,
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/certificate/${certificate.certificateId}`
    });
  } catch (error) {
    console.error('Share certificate error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user progress
router.get('/progress/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const progress = userProgress[userId];

    if (!progress) {
      return res.json({
        success: true,
        progress: {
          totalChallenges: 0,
          challengesByType: {},
          certificates: []
        }
      });
    }

    // Get full certificate details
    const userCertificates = certificates.filter(cert => 
      progress.certificates.includes(cert.id)
    );

    res.json({
      success: true,
      progress: {
        ...progress,
        certificates: userCertificates
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate certificate HTML
function generateCertificateHTML(certificate) {
  const completionDate = new Date(certificate.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Completion - ${certificate.userName}</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .certificate {
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            width: 100%;
            border: 8px solid #f8f9fa;
            position: relative;
        }
        .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 3px solid #667eea;
            border-radius: 10px;
        }
        .header {
            color: #667eea;
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .subtitle {
            color: #6c757d;
            font-size: 24px;
            margin-bottom: 40px;
        }
        .recipient {
            font-size: 36px;
            color: #2c3e50;
            margin: 30px 0;
            font-weight: bold;
            text-decoration: underline;
            text-decoration-color: #667eea;
        }
        .achievement {
            font-size: 20px;
            color: #495057;
            margin: 20px 0;
            line-height: 1.6;
        }
        .challenge-name {
            color: #667eea;
            font-weight: bold;
            font-size: 24px;
        }
        .details {
            display: flex;
            justify-content: space-around;
            margin: 40px 0;
            flex-wrap: wrap;
        }
        .detail-item {
            text-align: center;
            margin: 10px;
        }
        .detail-label {
            font-size: 14px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .detail-value {
            font-size: 18px;
            color: #2c3e50;
            font-weight: bold;
            margin-top: 5px;
        }
        .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: end;
        }
        .signature {
            text-align: center;
        }
        .signature-line {
            border-top: 2px solid #667eea;
            width: 200px;
            margin: 20px auto 10px;
        }
        .signature-text {
            color: #6c757d;
            font-size: 14px;
        }
        .verification {
            margin-top: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .verification-code {
            font-family: 'Courier New', monospace;
            font-weight: bold;
            color: #667eea;
            font-size: 16px;
        }
        .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 32px;
            font-weight: bold;
        }
        @media print {
            body { background: white; padding: 0; }
            .certificate { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="logo">C</div>
        <div class="header">CERTIFICATE</div>
        <div class="subtitle">of Completion</div>
        
        <div class="achievement">
            This is to certify that
        </div>
        
        <div class="recipient">${certificate.userName}</div>
        
        <div class="achievement">
            has successfully completed the<br>
            <span class="challenge-name">${certificate.challengeName}</span><br>
            ${certificate.challengeType.toUpperCase()} Challenge
        </div>
        
        <div class="details">
            <div class="detail-item">
                <div class="detail-label">Language</div>
                <div class="detail-value">${certificate.language}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Difficulty</div>
                <div class="detail-value">${certificate.difficulty}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Score</div>
                <div class="detail-value">${certificate.score}%</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Completed</div>
                <div class="detail-value">${completionDate}</div>
            </div>
        </div>
        
        <div class="signature-section">
            <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-text">Codex Platform</div>
            </div>
            <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-text">Date Issued</div>
            </div>
        </div>
        
        <div class="verification">
            <strong>Verification Code:</strong> 
            <span class="verification-code">${certificate.verificationCode}</span><br>
            <small>Verify at: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${certificate.verificationCode}</small>
        </div>
    </div>
</body>
</html>`;
}

module.exports = router;