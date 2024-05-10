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
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
              minLength: 3,
            },
          },
          example: {
            id: '5e5207c1-5009-4c14-b9da-d92517c8835e',
            name: 'Refeição',
          },
        },
        DishDetails: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            category_id: {
              type: 'string',
              format: 'uuid',
            },
            category: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            price: {
              type: 'number',
              format: 'float',
            },
            image_id: {
              type: 'string',
              format: 'uuid',
            },
            image_url: {
              type: 'string',
            },
            ingredients: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Ingredient',
              },
            },
            created_at: {
              type: 'string',
            },
            updated_at: {
              type: 'string',
            },
          },
          example: {
            id: '80140c40-03a9-4878-9ee9-6577105cd6b0',
            category_id: '5d4f91f1-bd87-4010-a694-314e3cbadde5',
            category: 'Refeições',
            name: 'Salada Ravanello',
            description:
              'Rabanetes, folhas verdes e molho agridoce salpicados com gergelim. O pão naan dá um toque especial.',
            price: 25,
            image_id: '6a88d673-309e-4837-9307-6ad7ff9abf38',
            image_url:
              'http://localhost:3333/images/5ac40b2c-4f3d-428a-ab56-961754663749-Mask group.png',
            ingredients: [
              {
                id: '4d6c8822-d98c-42f3-a421-1bd4a0ee8c1a',
                name: 'alface',
              },
              {
                id: '3b4aa3b6-abe4-41f9-a327-1f9ce38f3221',
                name: 'cebola',
              },
              {
                id: '66fd4d21-9c68-4f73-8130-49788ed16fbe',
                name: 'pão naan',
              },
              {
                id: '13ed457f-722d-4bf7-81f8-29a6b28c04fa',
                name: 'pepino',
              },
              {
                id: '957d3057-f652-45ac-a337-7e04a2ac976c',
                name: 'rabanete',
              },
              {
                id: 'b6f2e3cf-b56c-4d1f-a201-05fe9bc25c98',
                name: 'tomate',
              },
            ],
            created_at: '2024-04-01T11:57:51.711Z',
            updated_at: '2024-04-05T22:47:09.182Z',
          },
        },
        Ingredient: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
          },
          example: {
            id: 'ae54e5e7-71b3-44c9-ab6a-756534e2b0af',
            name: 'Pão naan',
          },
        },
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
