const db = require('./connection');

// Example query to fetch all users
async function getAllUsers() {
  const [rows] = await db.query('SELECT * FROM Users');
  return rows;
}

// Example query to insert a new user
async function createUser(username, email, passwordHash, profilePictureUrl = null, bio = null) {
  const [result] = await db.query(
    'INSERT INTO Users (username, email, password_hash, profile_picture_url, bio) VALUES (?, ?, ?, ?, ?)',
    [username, email, passwordHash, profilePictureUrl, bio]
  );
  return result.insertId;
}

module.exports = {
  getAllUsers,
  createUser,
};
