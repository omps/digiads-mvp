db = db.getSiblingDB('socioboard_feeds');

db.createCollection('feeds');
db.createCollection('feed_sources');
db.createCollection('feed_items');
db.createCollection('feed_categories');
db.createCollection('trending_topics');

// Create indexes
db.feeds.createIndex({ user_id: 1 });
db.feeds.createIndex({ created_at: -1 });
db.feed_sources.createIndex({ user_id: 1 });
db.feed_sources.createIndex({ url: 1 });
db.feed_items.createIndex({ feed_id: 1 });
db.feed_items.createIndex({ published_at: -1 });
db.feed_items.createIndex({ source_url: 1 });
db.feed_categories.createIndex({ name: 1 });
db.trending_topics.createIndex({ trend_date: -1 });

db = db.getSiblingDB('socioboard_notifications');

db.createCollection('notifications');
db.createCollection('notification_preferences');
db.createCollection('notification_templates');

// Create indexes
db.notifications.createIndex({ user_id: 1 });
db.notifications.createIndex({ created_at: -1 });
db.notifications.createIndex({ is_read: 1 });
db.notification_preferences.createIndex({ user_id: 1 });

print('MongoDB initialization completed');