const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mamamouad76@',
  database: 'salonbooking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Use promise API
const promisePool = pool.promise(); // Correct way to use promise API with mysql2

// Export the promisePool for use in other parts of the app
module.exports = promisePool;
