// Feed Item Model
module.exports = {
  collection: 'feed_items',
  schema: {
    feed_id: 'ObjectId',
    title: 'String',
    content: 'String',
    url: 'String',
    guid: 'String',
    published_date: 'Date',
    is_favorited: 'Boolean',
    categories: 'Array',
    created_at: 'Date'
  }
};