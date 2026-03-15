const fs = require('fs');
fs.writeFileSync('running_flag.txt', 'running');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
console.log('Testing connection string:', connectionString);

const pool = new Pool({ connectionString });

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connection to PostgreSQL successful!');
    const res = await client.query('SELECT current_database(), current_user');
    console.log('Database Info:', res.rows[0]);
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  }
}

testConnection();
