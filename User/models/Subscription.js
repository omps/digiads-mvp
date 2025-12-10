// Subscription Model
module.exports = {
  table: 'subscriptions',
  fields: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    team_id: 'INT NOT NULL',
    plan_type: 'VARCHAR(50) NOT NULL',
    status: "ENUM('active', 'cancelled') DEFAULT 'active'",
    amount: 'DECIMAL(10, 2)',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  }
};