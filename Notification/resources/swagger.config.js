const swaggerDoc = {
  openapi: '3.0.0',
  info: {
    title: 'Notification Service API',
    version: '1.0.0',
    description: 'Real-time notifications microservice'
  },
  servers: [{ url: 'http://localhost:3003' }]
};

console.log('✅ Swagger configuration loaded');
export default swaggerDoc;
