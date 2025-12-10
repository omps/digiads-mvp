const swaggerDoc = {
  openapi: '3.0.0',
  info: {
    title: 'Feeds Service API',
    version: '1.0.0',
    description: 'Feed aggregation and curation microservice'
  },
  servers: [{ url: 'http://localhost:3002' }]
};

console.log('✅ Swagger configuration loaded');
export default swaggerDoc;
