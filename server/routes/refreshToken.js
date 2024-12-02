import jwt from 'jsonwebtoken';

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ success: false, error: 'No refresh token provided' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Generate a new access token
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
      expiresIn: '15m', // Short-lived access token
    });

    res.json({ success: true, accessToken });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(401).json({ success: false, error: 'Invalid refresh token' });
  }
});