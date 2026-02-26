const { Pool } = require('pg');
const env = require('./env');

const isCloud = env.NODE_ENV === 'production' || (env.DATABASE_URL && env.DATABASE_URL.includes('supabase'));

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ...(isCloud && { ssl: { rejectUnauthorized: false } })
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    // process.exit(-1); removed to prevent Serverless function crash
});

module.exports = pool;
