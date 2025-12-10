// Analytics Model
module.exports = {
  table: 'post_analytics',
  fields: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    post_id: 'INT NOT NULL',
    platform: 'VARCHAR(50)',
    likes: 'INT DEFAULT 0',
    comments: 'INT DEFAULT 0',
    shares: 'INT DEFAULT 0',
    reach: 'INT DEFAULT 0',
    tracked_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  }
};