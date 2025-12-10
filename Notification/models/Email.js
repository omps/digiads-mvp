// Email Model
module.exports = {
  collection: 'email_queue',
  schema: {
    user_id: 'ObjectId',
    to: 'String',
    subject: 'String',
    body: 'String',
    status: 'String',
    sent_at: 'Date',
    created_at: 'Date'
  }
};