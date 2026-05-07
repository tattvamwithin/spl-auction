require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function test() {
  try {
    const result = await sql`SELECT 1 as test`;
    console.log('Connection successful:', result);
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

test();
