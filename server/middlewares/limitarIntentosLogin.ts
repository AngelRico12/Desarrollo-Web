import rateLimit from 'express-rate-limit';

export const limitarIntentosLogin = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5,
  handler: (req, res) => {
    console.log(`IP bloqueada: ${req.ip}`);
    res.status(429).json({ success: false, message: 'Demasiados intentos, intente más tarde.' });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
