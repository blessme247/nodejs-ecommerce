import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 100,
  message: 'You have exceeded the 100 requests in 15 minutes limit!', 
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 20,
  message: 'Rate limit exceeded!', 
  standardHeaders: true,
  legacyHeaders: false,
});