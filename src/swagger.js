const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StudySync API',
      version: '1.0.0',
      description: 'API REST para gestión de grupos de estudio — Programación IV, UPDS 2026',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local' },
      { url: 'https://studysync-api-prv0.onrender.com', description: 'Producción' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [path.join(__dirname, './routes/*.js')],
};

module.exports = swaggerJsdoc(options);