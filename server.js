const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Generate OTP secret and QR code
app.get('/generate-otp', (req, res) => {
  const secret = speakeasy.generateSecret({ name: '2FA-OTP-Live-App' });

  QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
    res.json({
      secret: secret.base32,
      otpAuthUrl: secret.otpauth_url,
      qrCode: data_url,
    });
  });
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
  const { token, secret } = req.body;

  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,
  });

  res.json({ verified });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
