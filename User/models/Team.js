// Team Model
module.exports = {
  table: 'teams',
  fields: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    name: 'VARCHAR(255) NOT NULL',
    owner_id: 'INT NOT NULL',
    plan_type: "ENUM('free', 'pro', 'enterprise') DEFAULT 'free'",
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  }
};