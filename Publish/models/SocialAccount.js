// Social Account Model
module.exports = {
  table: 'social_accounts',
  fields: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    user_id: 'INT NOT NULL',
    platform: 'VARCHAR(50) NOT NULL',
    username: 'VARCHAR(255)',
    access_token: 'VARCHAR(500)',
    is_connected: 'BOOLEAN DEFAULT TRUE',
    connected_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  }
};