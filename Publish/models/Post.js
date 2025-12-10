// Post Model
module.exports = {
  table: 'posts',
  fields: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    user_id: 'INT NOT NULL',
    content: 'LONGTEXT NOT NULL',
    platforms: 'JSON',
    status: "ENUM('draft', 'scheduled', 'published') DEFAULT 'draft'",
    scheduled_time: 'DATETIME',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  }
};