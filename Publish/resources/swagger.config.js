const swaggerDoc = {
  openapi: '3.0.0',
  info: {
    title: 'Publish Service API',
    version: '1.0.0',
    description: 'Social media publishing microservice'
  },
  servers: [{ url: 'http://localhost:3001' }]
};

console.log('✅ Swagger configuration loaded');
export default swaggerDoc;
