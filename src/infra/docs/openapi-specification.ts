import swaggerJsdoc from 'swagger-jsdoc'

export const openapiSpecification = swaggerJsdoc({
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Food Explorer API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ValidationError: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
            },
            fields: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
            message: {
              type: 'string',
            },
          },
        },
        GeneralError: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
            },
            message: {
              type: 'string',
            },
          },
        },
        InternalServerError: {
          allOf: [{ $ref: '#/components/schemas/GeneralError' }],
          example: {
            message: 'Internal server error',
            statusCode: 500,
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/infra/http/controllers/**/*.ts'],
})
