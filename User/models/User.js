// User Model
module.exports = {
  table: 'users',
  fields: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    email: 'VARCHAR(255) UNIQUE NOT NULL',
    username: 'VARCHAR(100) UNIQUE NOT NULL',
    password_hash: 'VARCHAR(255) NOT NULL',
    first_name: 'VARCHAR(100)',
    last_name: 'VARCHAR(100)',
    status: "ENUM('active', 'inactive') DEFAULT 'active'",
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  }
};