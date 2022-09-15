import sgMail from '@sendgrid/mail';
import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import { Express } from 'express';
import { UniqueConstraintError } from 'sequelize';
import { createSandbox, SinonStub } from 'sinon';
import { noCallThru } from 'proxyquire';
import HttpStatus from '../../src/models/enums/http-status.enum';
import User from '../../src/models/user.model';

use(chaiHttp);

const proxyquire = noCallThru();

const authControllerMock = proxyquire('../../src/controllers/auth.controller', {
    jsonwebtoken: { sign: () => 'mockToken' },
  }).default,
  authRoutesMock = proxyquire('../../src/routes/auth.routes', {
    '../controllers/auth.controller': authControllerMock,
  }).default;

const app: Express = proxyquire('../../src/express', {
  './routes/auth.routes': authRoutesMock,
}).default;

describe('auth integration tests', () => {
  const sandbox = createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('register', () => {
    let createUserStub: SinonStub;

    beforeEach(() => {
      createUserStub = sandbox.stub();

      sandbox.stub(User, 'create').callsFake(createUserStub);
      sandbox.stub(sgMail, 'send').resolves(undefined);
      sandbox.stub(sgMail, 'setApiKey').returns(undefined);
    });

    describe('valid body', () => {
      const body = {
        email: 'abc@def.com',
        password: 'ABCdef123_',
        passwordConfirmation: 'ABCdef123_',
      };

      it('should register correctly', async () => {
        const fakeUser = sandbox.createStubInstance(User);
        fakeUser.id = 1;
        fakeUser.email = 'abc@def.com';

        createUserStub.resolves(fakeUser);

        const res = await request(app).post('/auth/register').send(body);

        expect(res.status).to.equal(HttpStatus.CREATED);
        expect(res.body).to.deep.equal({ user: { id: 1, email: body.email } });
      });

      it('user already exists - should return 409 status', async () => {
        createUserStub.rejects(new UniqueConstraintError({}));

        const res = await request(app).post('/auth/register').send(body);

        expect(res.status).to.equal(HttpStatus.CONFLICT);
        expect(res.body).to.deep.equal({
          statusCode: HttpStatus.CONFLICT,
          name: 'Conflict',
          message: 'Email is already in use.',
        });
      });

      it('should return 500 status', async () => {
        createUserStub.rejects(new Error());

        const res = await request(app).post('/auth/register').send(body);

        expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });

    describe('invalid body', () => {
      const body = {
        email: 'abc@def.com',
        password: 'ABCdef123_',
        passwordConfirmation: 'ABCdef123',
      };

      it('should return 400 status code', async () => {
        const res = await request(app).post('/auth/register').send(body);

        expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

        expect(res.body).to.deep.equal({
          statusCode: HttpStatus.BAD_REQUEST,
          name: 'Bad Request',
          message: {
            description: 'Validation error.',
            errors: ['passwords do not match.'],
          },
        });
      });
    });
  });

  describe('login', () => {
    describe('valid request body', () => {
      const body = { email: 'abc@def.com', password: 'ABCdef123_' };

      it('should log in successfully', async () => {
        sandbox
          .stub(User, 'checkUser')
          .resolves(sandbox.createStubInstance(User));

        const res = await request(app).post('/auth/login').send(body);

        expect(res.status).to.equal(HttpStatus.OK);
        expect(res.body).to.deep.equal({ token: 'mockToken' });
      });

      it('should return 401 response', async () => {
        sandbox.stub(User, 'checkUser').resolves(null);

        const res = await request(app).post('/auth/login').send(body);

        expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);

        expect(res.body).to.deep.equal({
          statusCode: HttpStatus.UNAUTHORIZED,
          name: 'Unauthorized',
          message: 'Invalid email or password.',
        });
      });

      it('should return 500 response', async () => {
        sandbox.stub(User, 'checkUser').rejects(new Error());

        const res = await request(app).post('/auth/login').send(body);

        expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });

    describe('invalid request body', () => {
      const body = { email: 'abc@def.com', password: 123 };

      it('should return a 400 response', async () => {
        const res = await request(app).post('/auth/login').send(body);

        expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

        expect(res.body).to.deep.equal({
          statusCode: HttpStatus.BAD_REQUEST,
          name: 'Bad Request',
          message: {
            description: 'Validation error.',
            errors: ['password must be a string'],
          },
        });
      });
    });
  });
});
