import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import { sign } from 'jsonwebtoken';
import { Sequelize } from 'sequelize-typescript';
import { Container } from 'typedi';
import appConfig from '../../src/config/app.config';
import DbConnection from '../../src/database/connection';
import Seeder from '../../src/database/seeder';
import app from '../../src/express';
import HttpStatus from '../../src/models/enums/http-status.enum';
import Movie from '../../src/models/movie.model';

use(chaiHttp);

/**
 * Checks if an array is sorted.
 * @param arr Array to check.
 * @param comparatorFunction Function to compare the elements of the array.
 * @returns A boolean indicating if the array is sorted or not.
 */
function isSorted<T = unknown>(
  arr: T[],
  comparatorFunction: (firstElement: T, secondElement: T) => boolean,
): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (!comparatorFunction(arr[i], arr[i + 1])) {
      return false;
    }
  }

  return true;
}

describe('movies e2e tests', () => {
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

  describe('/movies', () => {
    describe('get', () => {
      it('default params', async () => {
        const res = await request(app).get('/movies');

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body)
          .to.have.property('data')
          .that.is.an('array')
          .and.has.lengthOf(4);

        expect(
          isSorted(
            res.body.data as Movie[],
            (a, b) => a.createdAt < b.createdAt,
          ),
        ).to.be.true;
      });

      it('pagination', async () => {
        const res = await request(app)
          .get('/movies')
          .query({ page: '2', limit: '2' });

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body)
          .to.have.property('data')
          .that.is.an('array')
          .and.has.length(2);
      });

      it('all filters', async () => {
        const res = await request(app).get('/movies').query({
          title: 'star wars',
          genre: '12',
          order: 'DESC',
        });

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body)
          .to.have.property('data')
          .that.is.an('array')
          .and.deep.equals([
            {
              id: 4,
              title: 'Rogue One: A Star Wars Story',
              imageUrl:
                'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Rogue_One%2C_A_Star_Wars_Story_poster.png/220px-Rogue_One%2C_A_Star_Wars_Story_poster.png',
              createdAt: new Date(2016, 12, 16).toISOString(),
            },
            {
              id: 3,
              title: 'Star Wars: Episode V - The Empire Strikes Back',
              imageUrl:
                'https://upload.wikimedia.org/wikipedia/en/3/3f/The_Empire_Strikes_Back_%281980_film%29.jpg',
              createdAt: new Date(1980, 5, 21).toISOString(),
            },
          ]);

        expect(
          isSorted(
            res.body.data as Movie[],
            (a, b) => a.createdAt > b.createdAt,
          ),
        ).to.be.true;
      });

      it('invalid genre shold be considered as null', async () => {
        const res = await request(app).get('/movies').query({ genre: 'abc' });

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body).to.have.property('data').that.deep.equals([]);
      });
    });

    describe('post', () => {
      it('shold return a 201 status code', async () => {
        const countBeforeCreate = await Movie.count();

        const res = await request(app)
          .post('/movies')
          .set('Authorization', bearerToken)
          .send({ title: 'Chicken Little', genreId: 3 });

        expect(res.status).to.equal(HttpStatus.CREATED);

        expect(res.body).to.have.property('id', countBeforeCreate + 1);
      });

      it('rshould return a 401 status code', async () => {
        const res = await request(app)
          .post('/movies')
          .send({ title: 'Chicken Little', genreId: 3 });

        expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      });

      it('shold return a 422 status code', async () => {
        const res = await request(app)
          .post('/movies')
          .set('Authorization', bearerToken)
          .send({ title: 'Chicken Little', genreId: 99 });

        expect(res.status).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      });
    });
  });

  describe('/movies/:id', () => {
    describe('get', () => {
      it('should return 200 status code with a movie', async () => {
        const res = await request(app).get('/movies/1');

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body).to.deep.equal({
          id: 1,
          title: 'Snow White and the Seven Dwarfs',
          genre: {
            id: 7,
            name: 'Fantasy',
            imageUrl:
              'https://st.depositphotos.com/1956729/1826/i/600/depositphotos_18265217-stock-photo-alien-world-in-winter.jpg',
          },
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/b/b0/Snow_white_1937_trailer_screenshot.jpg',
          rating: 4.3,
          createdAt: new Date(1937, 12, 21).toISOString(),
          characters: [
            {
              id: 1,
              name: 'Snow White',
              imageUrl:
                'https://static.wikia.nocookie.net/disney/images/3/33/Profile_-_Snow_White.jpeg/revision/latest/scale-to-width-down/782?cb=20200916135241',
            },
            {
              id: 2,
              name: 'Magic Mirror',
              imageUrl:
                'https://static.wikia.nocookie.net/disney/images/f/f9/Snowwhite-disneyscreencaps.com-100.jpg/revision/latest/scale-to-width-down/223?cb=20201125093643',
            },
          ],
        });
      });

      it('should return a 404 status code', async () => {
        const res = await request(app).get('/movies/99');

        expect(res.status).to.equal(HttpStatus.NOT_FOUND);
      });
    });

    describe('patch', () => {
      it('should return 200 status code', async () => {
        const res = await request(app)
          .patch('/movies/1')
          .set('Authorization', bearerToken)
          .send({ title: 'test' });

        expect(res.status).to.equal(HttpStatus.OK);

        expect(
          await Movie.findOne({
            attributes: ['id'],
            where: { id: 1, title: 'test' },
          }),
        ).to.not.be.null;
      });

      it('should return 401 status code', async () => {
        const res = await request(app)
          .patch('/movies/1')
          .send({ title: 'test' });

        expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      });

      it('should return 422 status code', async () => {
        const res = await request(app)
          .patch('/movies/1')
          .set('Authorization', bearerToken)
          .send({ genreId: 99 });

        expect(res.status).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      });

      it('should return a 404 status code', async () => {
        const res = await request(app)
          .patch('/movies/99')
          .set('Authorization', bearerToken)
          .send({ title: 'test' });

        expect(res.status).to.equal(HttpStatus.NOT_FOUND);
      });
    });

    describe('delete', () => {
      it('should return a 200 status code', async () => {
        const res = await request(app)
          .delete('/movies/1')
          .set('Authorization', bearerToken);

        expect(res.status).to.equal(HttpStatus.OK);

        expect(await Movie.findByPk(1)).to.be.null;
      });

      it('should return 401 status code', async () => {
        const res = await request(app).delete('/movies/1');

        expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      });

      it('should return a 404 status code', async () => {
        const res = await request(app)
          .delete('/movies/999')
          .set('Authorization', bearerToken);

        expect(res.status).to.equal(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe('POST /movies/:id/characters', () => {
    it('should return a 201 status code', async () => {
      const res = await request(app)
        .post('/movies/1/characters')
        .set('Authorization', bearerToken)
        .send({ characterId: 3 });

      expect(res.status).to.equal(HttpStatus.CREATED);
    });

    it('should return 401 status code', async () => {
      const res = await request(app)
        .post('/movies/1/characters')
        .send({ characterId: 3 });

      expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
    });

    it('should return a 409 status code', async () => {
      const res = await request(app)
        .post('/movies/1/characters')
        .set('Authorization', bearerToken)
        .send({ characterId: 1 });

      expect(res.status).to.equal(HttpStatus.CONFLICT);
    });

    it('should return a 422 status code', async () => {
      const res = await request(app)
        .post('/movies/1/characters')
        .set('Authorization', bearerToken)
        .send({ characterId: 99 });

      expect(res.status).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return a 404 status code', async () => {
      const res = await request(app)
        .post('/movies/99/characters')
        .set('Authorization', bearerToken)
        .send({ characterId: 1 });

      expect(res.status).to.equal(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /movies/:idMovie/characters/:idCharacter', () => {
    it('should return a 200 status code', async () => {
      const res = await request(app)
        .delete('/movies/1/characters/1')
        .set('Authorization', bearerToken);

      expect(res.status).to.equal(HttpStatus.OK);
    });

    it('should return a 401 status code', async () => {
      const res = await request(app).delete('/movies/1/characters/1');

      expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
    });

    it('should return a 404 status code - movie not found', async () => {
      const res = await request(app)
        .delete('/movies/99/characters/1')
        .set('Authorization', bearerToken);

      expect(res.status).to.equal(HttpStatus.NOT_FOUND);

      expect(res.body).to.have.property('message', 'Movie not found.');
    });

    it('should return a 404 status code - character not found', async () => {
      const res = await request(app)
        .delete('/movies/1/characters/99')
        .set('Authorization', bearerToken);

      expect(res.status).to.equal(HttpStatus.NOT_FOUND);

      expect(res.body).to.have.property('message', 'Character not found.');
    });
  });
});
