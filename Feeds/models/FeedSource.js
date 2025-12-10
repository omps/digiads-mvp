// Feed Source Model
module.exports = {
  collection: 'feed_sources',
  schema: {
    user_id: 'ObjectId',
    team_id: 'ObjectId',
    name: 'String',
    url: 'String',
    feed_type: 'String',
    is_active: 'Boolean',
    last_fetched: 'Date',
    created_at: 'Date'
  }
};