const pool = require('./connection');

async function testConnection() {
  try {
    // Test the connection by running a simple query
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('Connection successful! Test query result:', rows[0].result);
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  } finally {
    // End the connection pool
    pool.end();
  }
}

testConnection();
