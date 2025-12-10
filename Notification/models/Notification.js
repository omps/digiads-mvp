// Notification Model
module.exports = {
  collection: 'notifications',
  schema: {
    user_id: 'ObjectId',
    team_id: 'ObjectId',
    type: 'String',
    title: 'String',
    message: 'String',
    is_read: 'Boolean',
    data: 'Mixed',
    created_at: 'Date'
  }
};