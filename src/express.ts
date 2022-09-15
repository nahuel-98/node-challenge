import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import { setup, serve } from 'swagger-ui-express';
import { Container } from 'typedi';
import AuthRoutes from './routes/auth.routes';
import CharactersRoutes from './routes/characters.routes';
import CommonRoutes from './routes/common.routes';
import MoviesRoutes from './routes/movies.routes';
import MailService from './controllers/services/mail.service';
import errorHandler from './middlewares/error-handler.middleware';
import errorLogger from './middlewares/error-logger.middleware';
import fallbackErrorTransformer from './middlewares/fallback-error-transformer.middleware';
import logger from './logger';
import requestLogger from './middlewares/request-logger.middleware';
import swaggerConfig from './config/swagger.config';
import syntaxErrorHandler from './middlewares/syntax-error-handler.middleware';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/docs', serve, setup(swaggerJSDoc(swaggerConfig)));

app.use(requestLogger);

Container.import([AuthRoutes, CharactersRoutes, MoviesRoutes]);
const routes: CommonRoutes[] = Container.getMany('routes');

routes.forEach((route) => {
  app.use(route.getBasePath(), route.getRouter());
  logger.info(`Routes configured for ${route.getBasePath()}`);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.on('event:userCreated', (email: any) =>
  Container.get(MailService).send(email),
);

app.use(syntaxErrorHandler);

app.use(errorLogger);

app.use(fallbackErrorTransformer);

app.use(errorHandler);

export default app;
