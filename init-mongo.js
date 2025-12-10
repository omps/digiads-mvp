// Initialize MongoDB databases and collections

db.getSiblingDB('admin').auth('admin', 'admin_pass_123');

// Create feeds database and collections
db = db.getSiblingDB('socioboard_feeds');

db.createCollection('feeds');
db.feeds.createIndex({ user_id: 1, team_id: 1 });
db.feeds.createIndex({ created_at: -1 });
db.feeds.createIndex({ source_id: 1 });

db.createCollection('feed_items');
db.feed_items.createIndex({ feed_id: 1 });
db.feed_items.createIndex({ published_date: -1 });
db.feed_items.createIndex({ guid: 1 }, { unique: true, sparse: true });
db.feed_items.createIndex({ is_favorited: 1 });
db.feed_items.createIndex({ categories: 1 });

db.createCollection('feed_sources');
db.feed_sources.createIndex({ user_id: 1, team_id: 1 });
db.feed_sources.createIndex({ is_active: 1 });
db.feed_sources.createIndex({ last_fetched: -1 });

db.createCollection('trending_content');
db.trending_content.createIndex({ score: -1 });
db.trending_content.createIndex({ created_at: -1 });
db.trending_content.createIndex({ category: 1 });

db.createCollection('content_library');
db.content_library.createIndex({ user_id: 1, team_id: 1 });
db.content_library.createIndex({ created_at: -1 });
db.content_library.createIndex({ tags: 1 });
db.content_library.createIndex({ is_favorited: 1 });

// Create notifications database and collections
db = db.getSiblingDB('socioboard_notifications');

db.createCollection('notifications');
db.notifications.createIndex({ user_id: 1 });
db.notifications.createIndex({ team_id: 1 });
db.notifications.createIndex({ created_at: -1 });
db.notifications.createIndex({ is_read: 1 });
db.notifications.createIndex({ type: 1 });
db.notifications.createCollection('exp', { expireAfterSeconds: 2592000 }); // 30 days TTL

db.createCollection('notification_preferences');
db.notification_preferences.createIndex({ user_id: 1 }, { unique: true });

db.createCollection('notification_history');
db.notification_history.createIndex({ user_id: 1 });
db.notification_history.createIndex({ created_at: -1 });
db.notification_history.createIndex({ created_at: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

db.createCollection('email_queue');
db.email_queue.createIndex({ user_id: 1 });
db.email_queue.createIndex({ status: 1 });
db.email_queue.createIndex({ created_at: -1 });
db.email_queue.createIndex({ created_at: 1 }, { expireAfterSeconds: 604800 }); // 7 days TTL

db.createCollection('broadcast_messages');
db.broadcast_messages.createIndex({ team_id: 1 });
db.broadcast_messages.createIndex({ created_at: -1 });
db.broadcast_messages.createIndex({ is_active: 1 });

db.createCollection('webhooks');
db.webhooks.createIndex({ user_id: 1, team_id: 1 });
db.webhooks.createIndex({ is_active: 1 });

print('MongoDB initialization completed successfully!');