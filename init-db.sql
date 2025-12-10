-- Create database if not exists
CREATE DATABASE IF NOT EXISTS socioboard_mvp;
USE socioboard_mvp;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_picture_url VARCHAR(500),
  bio TEXT,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_status (status)
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id INT NOT NULL,
  plan_type ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
  max_members INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_owner_id (owner_id)
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  team_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('owner', 'admin', 'editor', 'viewer') DEFAULT 'viewer',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_team_user (team_id, user_id),
  INDEX idx_team_id (team_id),
  INDEX idx_user_id (user_id)
);

-- Social Media Accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  team_id INT,
  platform VARCHAR(50) NOT NULL,
  account_id VARCHAR(255),
  username VARCHAR(255),
  access_token VARCHAR(500),
  refresh_token VARCHAR(500),
  token_expires_at DATETIME,
  account_data JSON,
  is_connected BOOLEAN DEFAULT TRUE,
  connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_team_id (team_id),
  INDEX idx_platform (platform)
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  team_id INT,
  title VARCHAR(255),
  content LONGTEXT NOT NULL,
  media_urls JSON,
  platforms JSON,
  status ENUM('draft', 'scheduled', 'published', 'failed') DEFAULT 'draft',
  scheduled_time DATETIME,
  published_time DATETIME,
  engagement_count INT DEFAULT 0,
  reach INT DEFAULT 0,
  impressions INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_team_id (team_id),
  INDEX idx_status (status),
  INDEX idx_scheduled_time (scheduled_time),
  INDEX idx_published_time (published_time)
);

-- Post analytics table
CREATE TABLE IF NOT EXISTS post_analytics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  platform VARCHAR(50),
  platform_post_id VARCHAR(255),
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  retweets INT DEFAULT 0,
  reach INT DEFAULT 0,
  impressions INT DEFAULT 0,
  engagement_rate DECIMAL(5, 2) DEFAULT 0,
  tracked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id),
  INDEX idx_platform (platform),
  INDEX idx_tracked_at (tracked_at)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  team_id INT NOT NULL,
  plan_type VARCHAR(50) NOT NULL,
  status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
  billing_period_start DATE,
  billing_period_end DATE,
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  stripe_subscription_id VARCHAR(255),
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  INDEX idx_team_id (team_id),
  INDEX idx_status (status)
);

-- Feed sources table
CREATE TABLE IF NOT EXISTS feed_sources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  team_id INT,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  feed_type ENUM('rss', 'atom', 'custom') DEFAULT 'rss',
  is_active BOOLEAN DEFAULT TRUE,
  last_fetched DATETIME,
  fetch_frequency INT DEFAULT 3600,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_team_id (team_id),
  INDEX idx_is_active (is_active)
);

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  role_name VARCHAR(50) NOT NULL,
  permissions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_role (user_id, role_name),
  INDEX idx_user_id (user_id)
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  team_id INT,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  last_used DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_team_id (team_id)
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INT,
  changes JSON,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);