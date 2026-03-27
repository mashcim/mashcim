const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const winston = require('winston');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json());

const users = [];
const securityEvents = [];
const scanResults = [];

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const scanSchema = Joi.object({
  target: Joi.string().required(),
  ports: Joi.string().pattern(/^\d+(-\d+)?$/).required()
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.post('/api/register', async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email, password } = req.body;

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username, email }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/scan', authenticateToken, async (req, res) => {
  try {
    const { error } = scanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { target, ports } = req.body;

    const scanId = Date.now().toString();
    const scanResult = {
      id: scanId,
      target,
      ports,
      status: 'completed',
      openPorts: [22, 80, 443],
      timestamp: new Date().toISOString(),
      userId: req.user.userId
    };

    scanResults.push(scanResult);

    const securityEvent = {
      id: securityEvents.length + 1,
      type: 'port_scan',
      target,
      timestamp: new Date().toISOString(),
      userId: req.user.userId,
      severity: 'info'
    };

    securityEvents.push(securityEvent);
    logger.info(`Port scan initiated: ${target} by user ${req.user.userId}`);

    res.json({
      message: 'Scan completed',
      scanResult
    });

  } catch (error) {
    logger.error('Scan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/scans', authenticateToken, (req, res) => {
  const userScans = scanResults.filter(scan => scan.userId === req.user.userId);
  res.json({
    scans: userScans,
    total: userScans.length
  });
});

app.get('/api/events', authenticateToken, (req, res) => {
  const userEvents = securityEvents.filter(event => event.userId === req.user.userId);
  res.json({
    events: userEvents,
    total: userEvents.length
  });
});

app.get('/api/stats', authenticateToken, (req, res) => {
  const userScans = scanResults.filter(scan => scan.userId === req.user.userId);
  const userEvents = securityEvents.filter(event => event.userId === req.user.userId);

  const stats = {
    totalScans: userScans.length,
    totalEvents: userEvents.length,
    securityScore: Math.max(0, 100 - (userEvents.filter(e => e.severity === 'high').length * 5)),
    lastScan: userScans.length > 0 ? userScans[userScans.length - 1].timestamp : null
  };

  res.json(stats);
});

app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`🔧 Security API server running on port ${PORT}`);
  console.log(`🔧 Security API server running on port ${PORT}`);
});

module.exports = app;
