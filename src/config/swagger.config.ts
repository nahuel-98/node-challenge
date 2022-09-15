import { join } from 'path';
import { Options } from 'swagger-jsdoc';

/**
 * Swagger options.
 */
const swaggerConfig: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'api-disney',
      version: '1.0.0',
      description: "Alkemy Challenge, Node.js.",
      license: {
        name: 'GPL 3.0',
        url: 'https://www.gnu.org/licenses/gpl-3.0.txt',
      },
    },
  },
  apis: [
    join(__dirname, '..', 'controllers', '*.controller.{t,j}s'),
    join(__dirname, '..', 'errors', '*.error.{t,j}s'),
    join(__dirname, '..', 'middlewares', '*.middleware.{t,j}s'),
    join(__dirname, '..', 'models', '*.model.{t,j}s'),
    join(__dirname, '..', 'models', 'types', '*.type.{t,j}s'),
    join(__dirname, '..', 'models', 'dto', '**', '*.dto.{t,j}s'),
    join(__dirname, '..', 'routes', '*.routes.{t,j}s'),
  ],
};

export default swaggerConfig;
