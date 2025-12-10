// Trending Content Model
module.exports = {
  collection: 'trending_content',
  schema: {
    title: 'String',
    url: 'String',
    category: 'String',
    score: 'Number',
    mentions: 'Number',
    created_at: 'Date'
  }
};