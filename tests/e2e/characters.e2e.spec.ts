import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import { sign } from 'jsonwebtoken';
import { Sequelize } from 'sequelize-typescript';
import { Container } from 'typedi';
import appConfig from '../../src/config/app.config';
import DbConnection from '../../src/database/connection';
import Seeder from '../../src/database/seeder';
import app from '../../src/express';
import Character from '../../src/models/character.model';
import HttpStatus from '../../src/models/enums/http-status.enum';

use(chaiHttp);

describe('characters e2e tests', () => {
  let db: Sequelize, seeder: Seeder, bearerToken: string;

  before(async () => {
    db = Container.get(DbConnection).getConnection();
    seeder = Container.get(Seeder);

    // the token will be used for future requests
    bearerToken =
      'Bearer ' +
      sign(
        { user: { id: 1, email: 'john.doe@domain.com' } },
        appConfig.JWT_SECRET_KEY,
      );

    // clear db to seed later
    await db.getQueryInterface().dropAllTables();
  });

  beforeEach(async () => {
    await db.sync();
    await seeder.initialize();
  });

  afterEach(async () => {
    await db.getQueryInterface().dropAllTables();
  });

  describe('/characters', () => {
    describe('get', () => {
      it('without filters', async () => {
        const res = await request(app).get('/characters');

        const count = await Character.count();

        expect(res.status).to.equal(HttpStatus.OK);
        expect(res.body).to.have.property('total', count);

        expect(res.body)
          .to.have.property('data')
          .that.is.an('array')
          .and.has.length(count);
      });

      it('pagination', async () => {
        const res = await request(app)
          .get('/characters')
          .query({ page: '2', limit: '2' });

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body)
          .to.have.property('data')
          .that.is.an('array')
          .and.has.length(2);
      });

      it('all filters', async () => {
        const res = await request(app)
          .get('/characters')
          .query({
            name: 'darth vader',
            age: '45',
            weight: { lte: '250' },
            movies: ['1', '3'],
          });

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body)
          .to.have.property('data')
          .that.is.an('array')
          .and.has.length(1);

        expect(res.body.data[0]).to.have.property('id', 4);
      });

      it('should return empty data on invalid age or weight', async () => {
        const res = await request(app)
          .get('/characters')
          .query({
            age: 'abc',
            weight: { lte: 'def' },
          });

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body)
          .to.have.property('data')
          .that.is.an('array')
          .and.has.length(0);
      });

      it('should consider invalid movies query param values as null', async () => {
        const res = await request(app)
          .get('/characters')
          .query({
            movies: ['abc', '1'], // transforms to [null, 1]
          });

        expect(res.status).to.equal(HttpStatus.OK);

        /**
         * Returns characters that appear in movies with id null or 1.
         * Since there are no movies with id = null, returns only characters
         * of movie id 1.
         */
        expect(res.body)
          .to.have.property('data')
          .that.is.an('array')
          .and.has.length(2);

        expect(res.body.data[0].id).to.equal(1);
        expect(res.body.data[1].id).to.equal(2);
      });
    });

    describe('post', () => {
      it('should create a new character', async () => {
        const countBeforeCreate = await Character.count();

        const res = await request(app)
          .post('/characters')
          .set('Authorization', bearerToken)
          .send({ name: 'Mickey Mouse' });

        expect(res.status).to.equal(HttpStatus.CREATED);

        expect(res.body).to.have.property('id', countBeforeCreate + 1);
      });

      it('should not authorize', async () => {
        const res = await request(app)
          .post('/characters')
          .send({ name: 'Mickey Mouse' });

        expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('/characters/:id', () => {
    describe('get', () => {
      it('should return character details', async () => {
        const res = await request(app).get('/characters/5');

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body).to.deep.equal({
          id: 5,
          name: 'Luke Skywalker',
          imageUrl:
            'https://static.wikia.nocookie.net/esstarwars/images/d/d9/Luke-rotjpromo.jpg/revision/latest/scale-to-width-down/350?cb=20071214134433',
          age: 22,
          weight: 73,
          history:
            "Originally a farmer on Tatooine living with his uncle and aunt, Luke becomes a pivotal figure in the Rebel Alliance's struggle against the Galactic Empire.The son of fallen Jedi Knight Anakin Skywalker(turned Sith Lord Darth Vader) and Padmé Amidala, Luke is the twin brother of Rebellion leader Princess Leia and eventual brother-in -law of the smuggler Han Solo.Luke trains to be a Jedi under Jedi Masters Obi - Wan Kenobi and Yoda and rebuilds the Jedi Order.",
          movies: [
            {
              id: 3,
              title: 'Star Wars: Episode V - The Empire Strikes Back',
              imageUrl:
                'https://upload.wikimedia.org/wikipedia/en/3/3f/The_Empire_Strikes_Back_%281980_film%29.jpg',
            },
          ],
        });
      });

      it('should return a 404 status code', async () => {
        const res = await request(app).get('/characters/999');

        expect(res.status).to.equal(HttpStatus.NOT_FOUND);
      });
    });

    describe('update', () => {
      it('should return 200 status code', async () => {
        const res = await request(app)
          .patch('/characters/5')
          .set('Authorization', bearerToken)
          .send({ name: 'test' });

        expect(res.status).to.equal(HttpStatus.OK);

        // check that chracter exists
        const character = await Character.findOne({
          where: { id: 5, name: 'test' },
          attributes: ['id'],
        });

        expect(character).to.not.be.null;
      });

      it('should return a 401 status code', async () => {
        const res = await request(app)
          .patch('/characters/5')
          .send({ name: 'test' });

        expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      });

      it('should return a 404 status code', async () => {
        const res = await request(app)
          .patch('/characters/999')
          .set('Authorization', bearerToken)
          .send({ name: 'test' });

        expect(res.status).to.equal(HttpStatus.NOT_FOUND);
      });
    });

    describe('delete', () => {
      it('should return 200 status code', async () => {
        const res = await request(app)
          .delete('/characters/5')
          .set('Authorization', bearerToken);

        expect(res.status).to.equal(HttpStatus.OK);

        const character = await Character.findByPk(5, {
          attributes: ['id'],
        });

        expect(character).to.be.null;
      });

      it('should return a 401 status code', async () => {
        const res = await request(app).delete('/characters/5');

        expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      });

      it('should return a 404 status code', async () => {
        const res = await request(app)
          .delete('/characters/999')
          .set('Authorization', bearerToken);

        expect(res.status).to.equal(HttpStatus.NOT_FOUND);
      });
    });
  });
});
