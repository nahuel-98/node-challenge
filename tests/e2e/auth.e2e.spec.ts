import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import { Sequelize } from 'sequelize-typescript';
import { Container } from 'typedi';
import isJwt from 'validator/lib/isJWT';
import DbConnection from '../../src/database/connection';
import Seeder from '../../src/database/seeder';
import app from '../../src/express';
import HttpStatus from '../../src/models/enums/http-status.enum';
import e2eConfig from './config';

use(chaiHttp);

describe('auth e2e tests', () => {
  let db: Sequelize, seeder: Seeder;

  before(async () => {
    db = Container.get(DbConnection).getConnection();
    await db.authenticate();

    seeder = Container.get(Seeder);
  });

  beforeEach(async () => {
    await db.sync({ force: true });
    await seeder.initialize();
  });

  afterEach(async () => {
    await db.getQueryInterface().dropAllTables();
  });

  describe('register', () => {
    it('should return a 201 status code and send an email', async () => {
      const timestamp = Date.now(),
        email = `${e2eConfig.TESTMAIL_NAMESPACE}.${timestamp}@inbox.testmail.app`;

      const [appResponse, mailResponse] = await Promise.all([
        request(app).post('/auth/register').send({
          email,
          password: 'abcDEF123!',
          passwordConfirmation: 'abcDEF123!',
        }),

        request('https://api.testmail.app').get('/api/json').query({
          apikey: e2eConfig.TESTMAIL_API_KEY,
          namespace: e2eConfig.TESTMAIL_NAMESPACE,
          tag: timestamp,
          livequery: true,
        }),
      ]);

      expect(appResponse.status).to.equal(HttpStatus.CREATED);
      expect(await appResponse.body).to.deep.equal({
        user: {
          id: 2,
          email,
        },
      });

      expect(mailResponse.status).to.equal(HttpStatus.OK);
      expect(mailResponse.body).to.have.property('count', 1);
    });

    it('should return a 409 status code', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'john.doe@domain.com',
        password: 'abcDEF123!',
        passwordConfirmation: 'abcDEF123!',
      });

      expect(res.status).to.equal(HttpStatus.CONFLICT);
    });
  });

  describe('login', () => {
    it('should return 200 status code', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'john.doe@domain.com',
        password: '1234567890',
      });

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body).to.have.property('token');
      expect(isJwt(res.body.token)).to.be.true;
    });

    it('should return 401 status code', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'john.doe@domain.com',
        password: '123456789',
      });

      expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
    });
  });
});
