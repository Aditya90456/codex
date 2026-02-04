const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage for certificates (in production, use a database)
let certificates = [];
let userProgress = {};

// Generate certificate
router.post('/generate', async (req, res) => {
  try {
    const { 
      userName, 
      userEmail, 
      challengeType, 
      challengeName, 
      completionTime, 
      score,
      language,
      difficulty 
    } = req.body;

    if (!userName || !challengeType || !challengeName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userName, challengeType, challengeName'
      });
    }

    const certificateId = uuidv4();
    const certificate = {
      id: certificateId,
      userName,
      userEmail,
      challengeType, // 'leetcode', 'dsa', 'coding-challenge'
      challengeName,
      completionTime,
      score: score || 100,
      language: language || 'JavaScript',
      difficulty: difficulty || 'Medium',
      completedAt: new Date().toISOString(),
      verificationCode: Math.random().toString(36).substring(2, 15).toUpperCase()
    };

    certificates.push(certificate);

    // Update user progress
    if (!userProgress[userName]) {
      userProgress[userName] = {
        totalChallenges: 0,
        challengesByType: {},
        certificates: []
      };
    }

    userProgress[userName].totalChallenges++;
    userProgress[userName].challengesByType[challengeType] = 
      (userProgress[userName].challengesByType[challengeType] || 0) + 1;
    userProgress[userName].certificates.push(certificateId);

    res.json({
      success: true,
      certificate,
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

// Get user progress
router.get('/user/:userName', (req, res) => {
  try {
    const { userName } = req.params;
    const progress = userProgress[userName];

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