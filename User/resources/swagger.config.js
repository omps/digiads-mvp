/**
 * Swagger Auto-generation Configuration
 * This file generates Swagger/OpenAPI documentation
 */

const swaggerDoc = {
  openapi: '3.0.0',
  info: {
    title: 'User Service API',
    version: '1.0.0',
    description: 'Authentication and user management microservice for DigiAds MVP'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

console.log('✅ Swagger configuration loaded');

export default swaggerDoc;
