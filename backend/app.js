const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('./src/config/env');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Trust the first proxy (Render's load balancer) to ensure rate limiting works properly
app.set('trust proxy', 1);

app.use(helmet());

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Apply rate limiting to all requests
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
app.use(globalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Setup specialized limiters based on path later inside specific routers

// Apply routes
app.use('/api/auth', require('./src/modules/auth/auth.routes'));
app.use('/api/habits', require('./src/modules/habits/habits.routes'));
app.use('/api/workouts', require('./src/modules/workouts/workouts.routes'));
app.use('/api/finance', require('./src/modules/finance/finance.routes'));

// Fallback for root
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Life Dashboard API is running.' });
});

// Fallback 404 for unknown routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

if (require.main === module) {
    const PORT = env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
