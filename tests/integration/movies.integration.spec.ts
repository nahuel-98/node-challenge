import { request, expect, use } from 'chai';
import chaiHttp from 'chai-http';
import passport from 'passport';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import {
  createSandbox,
  SinonSandbox,
  SinonStub,
  SinonStubbedInstance,
} from 'sinon';
import app from '../../src/express';
import HttpStatus from '../../src/models/enums/http-status.enum';
import Genre from '../../src/models/genre.model';
import MovieCharacter from '../../src/models/movie-character.model';
import Movie from '../../src/models/movie.model';
import User from '../../src/models/user.model';

use(chaiHttp);

describe('/movies integration test', () => {
  let sandbox: SinonSandbox, passportStub: SinonStub;

  before(() => {
    sandbox = createSandbox();
  });

  beforeEach(() => {
    passportStub = sandbox
      .stub(passport, 'authenticate')
      .returns(() => undefined);

    sandbox.stub(User, 'findByPk').resolves(sandbox.createStubInstance(User));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('/movies', () => {
    describe('get', () => {
      it('should return 200 status code', async () => {
        sandbox
          .stub(Movie, 'findAndCountAll')
          .resolves({ rows: [], count: 0 as any }); 

        const res = await request(app).get('/movies');

        expect(res.status).to.equal(HttpStatus.OK);
        expect(res.body).to.deep.equal({
          data: [],
          total: 0,
          totalPages: 0,
        });
      });

      it('should return 500 status code', async () => {
        sandbox.stub(Movie, 'findAndCountAll').rejects(new Error());

        const res = await request(app).get('/movies');

        expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });

    describe('post', () => {
      const body = { title: 'The Lion King', genreId: 1 };

      describe('authenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, { id: 1, email: 'abc@gmail.com' });
        });

        it('should return 201 status code', async () => {
          const mockMovie = sandbox.createStubInstance(Movie);
          mockMovie.id = 1;

          sandbox.stub(Movie, 'create').resolves(mockMovie);

          const res = await request(app).post('/movies').send(body);

          expect(res.status).to.equal(HttpStatus.CREATED);
        });

        it('should return 400 status code', async () => {
          const res = await request(app).post('/movies').send({ title: 'abc' });

          expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

          expect(res.body)
            .to.have.property('message')
            .that.has.deep.property('errors', [
              'genreId must be an integer number',
            ]);
        });

        it('should return 422 status code', async () => {
          sandbox
            .stub(Movie, 'create')
            .rejects(new ForeignKeyConstraintError({}));

          const res = await request(app).post('/movies').send(body);

          expect(res.status).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);

          expect(res.body).to.have.property(
            'message',
            'Genre with id 1 does not exist.',
          );
        });

        it('should return 500 status code', async () => {
          sandbox.stub(Movie, 'create').rejects(new Error());

          const res = await request(app).post('/movies').send(body);

          expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
        });
      });

      describe('unauthenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, null);
        });

        it('should return 401 status code', async () => {
          const res = await request(app).post('/movies').send(body);

          expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
        });
      });
    });
  });

  describe('/movies/:id', () => {
    describe('get', () => {
      it('should return 200 status code with a movie', async () => {
        const mockGenre = sandbox.createStubInstance(Genre);
        mockGenre.id = 1;
        mockGenre.name = 'Drama';

        const mockMovie = sandbox.createStubInstance(Movie);
        mockMovie.id = 1;
        mockMovie.genreId = 1;
        mockMovie.genre = mockGenre;
        mockMovie.createdAt = new Date('2022-01-01T00:00:00.000Z');
        mockMovie.characters = [];

        sandbox.stub(Movie, 'findByPk').resolves(mockMovie);

        const res = await request(app).get('/movies/1');

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body).to.deep.equal({
          id: 1,
          genre: {
            id: 1,
            name: 'Drama',
          },
          createdAt: '2022-01-01T00:00:00.000Z',
          characters: [],
        });
      });

      it('should return a 400 status code', async () => {
        const res = await request(app).get('/movies/abc');

        expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

        expect(res.body)
          .to.have.property('message')
          .that.has.deep.property('errors', ['id must be a number string']);
      });

      it('should return a 404 status code', async () => {
        sandbox.stub(Movie, 'findByPk').resolves(null);

        const res = await request(app).get('/movies/1');

        expect(res.status).to.equal(HttpStatus.NOT_FOUND);
      });

      it('should return a 500 status code', async () => {
        sandbox.stub(Movie, 'findByPk').rejects(new Error());

        const res = await request(app).get('/movies/1');

        expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });

    describe('patch', () => {
      const body = { title: 'The Lion King', genreId: 1 };

      describe('authenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, { id: 1, email: 'abc@gmail.com' });
        });

        describe('movie found', () => {
          let mockMovie: SinonStubbedInstance<Movie>;

          beforeEach(() => {
            mockMovie = sandbox.createStubInstance(Movie);

            sandbox.stub(Movie, 'findByPk').resolves(mockMovie);
            mockMovie.save.resolves(mockMovie);
          });

          it('should return 200 status code', async () => {
            const res = await request(app).patch('/movies/1').send(body);

            expect(res.status).to.equal(HttpStatus.OK);
          });

          it('should return 400 status code', async () => {
            const res = await request(app)
              .patch('/movies/1')
              .send({ imageUrl: 'abc' });

            expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

            expect(res.body)
              .to.have.property('message')
              .that.has.deep.property('errors', [
                'imageUrl must be an URL address',
              ]);
          });

          it('should return 422 status code', async () => {
            mockMovie.save.rejects(new ForeignKeyConstraintError({}));

            const res = await request(app).patch('/movies/1').send(body);

            expect(res.status).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);

            expect(res.body).to.have.property(
              'message',
              'Genre with id 1 does not exist.',
            );
          });

          it('should return 500 status code', async () => {
            mockMovie.save.rejects(new Error());

            const res = await request(app).patch('/movies/1').send(body);

            expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
          });
        });

        describe('movie not found', () => {
          beforeEach(() => {
            sandbox.stub(Movie, 'findByPk').resolves(null);
          });

          it('should return a 404 status code', async () => {
            const res = await request(app).patch('/movies/1').send(body);

            expect(res.status).to.equal(HttpStatus.NOT_FOUND);
          });
        });
      });

      describe('unauthenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, null);
        });

        it('should return 401 status code', async () => {
          const res = await request(app).patch('/movies/1').send(body);

          expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
        });
      });
    });

    describe('delete', () => {
      describe('authenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, { id: 1, email: 'abc@gmail.com' });
        });

        it('should return a 200 status code', async () => {
          sandbox.stub(Movie, 'destroy').resolves(1);

          const res = await request(app).delete('/movies/1');

          expect(res.status).to.equal(HttpStatus.OK);
        });

        it('should return a 400 status code', async () => {
          const res = await request(app).delete('/movies/abc');

          expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

          expect(res.body)
            .to.have.property('message')
            .that.has.deep.property('errors', ['id must be a number string']);
        });

        it('should return a 404 status code', async () => {
          sandbox.stub(Movie, 'destroy').resolves(0);

          const res = await request(app).delete('/movies/1');

          expect(res.status).to.equal(HttpStatus.NOT_FOUND);
        });

        it('should return a 500 status code', async () => {
          sandbox.stub(Movie, 'destroy').rejects(new Error());

          const res = await request(app).delete('/movies/1');

          expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
        });
      });

      describe('unauthenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, null);
        });

        it('should return 401 status code', async () => {
          const res = await request(app).delete('/movies/1');

          expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
        });
      });
    });
  });

  describe('POST /movies/:id/characters', () => {
    const body = { characterId: 1 };

    describe('authenticated', () => {
      beforeEach(() => {
        passportStub.yieldsAsync(null, { id: 1, email: 'abc@gmail.com' });
      });

      describe('movie exists', () => {
        beforeEach(() => {
          sandbox
            .stub(Movie, 'findOne')
            .resolves(sandbox.createStubInstance(Movie));
        });

        it('should return a 201 status code', async () => {
          sandbox
            .stub(MovieCharacter, 'create')
            .resolves(sandbox.createStubInstance(MovieCharacter));

          const res = await request(app)
            .post('/movies/1/characters')
            .send(body);

          expect(res.status).to.equal(HttpStatus.CREATED);
        });

        it('should return a 400 status code', async () => {
          const res = await request(app)
            .post('/movies/1/characters')
            .send({ characterId: '1' });

          expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

          expect(res.body)
            .to.have.property('message')
            .that.has.deep.property('errors', [
              'characterId must be an integer number',
            ]);
        });

        it('should return a 409 status code', async () => {
          sandbox
            .stub(MovieCharacter, 'create')
            .rejects(new UniqueConstraintError({}));

          const res = await request(app)
            .post('/movies/1/characters')
            .send(body);

          expect(res.status).to.equal(HttpStatus.CONFLICT);
        });

        it('should return a 422 status code', async () => {
          sandbox
            .stub(MovieCharacter, 'create')
            .rejects(new ForeignKeyConstraintError({}));

          const res = await request(app)
            .post('/movies/1/characters')
            .send(body);

          expect(res.status).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
        });

        it('should return a 500 status code', async () => {
          sandbox.stub(MovieCharacter, 'create').rejects(new Error());

          const res = await request(app)
            .post('/movies/1/characters')
            .send(body);

          expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
        });
      });

      describe('movie does not exist', () => {
        beforeEach(() => {
          sandbox.stub(Movie, 'findOne').resolves(null);
        });

        it('should return a 404 status code', async () => {
          const res = await request(app)
            .post('/movies/1/characters')
            .send(body);

          expect(res.status).to.equal(HttpStatus.NOT_FOUND);
        });
      });
    });

    describe('unauthenticated', () => {
      beforeEach(() => {
        passportStub.yieldsAsync(null, null);
      });

      it('should return 401 status code', async () => {
        const res = await request(app).post('/movies/1/characters').send(body);

        expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('DELETE /movies/:idMovie/characters/:idCharacter', () => {
    describe('authenticated', () => {
      beforeEach(() => {
        passportStub.yieldsAsync(null, { id: 1, email: 'abc@gmail.com' });
      });

      describe('relation found', () => {
        beforeEach(() => {
          sandbox.stub(MovieCharacter, 'destroy').resolves(1);
        });

        it('should return a 200 status code', async () => {
          const res = await request(app).delete('/movies/1/characters/1');

          expect(res.status).to.equal(HttpStatus.OK);
        });

        it('should return a 400 status code', async () => {
          const res = await request(app).delete('/movies/abc/characters/def');

          expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

          expect(res.body)
            .to.have.property('message')
            .that.has.deep.property('errors', [
              'movieId must be a number string',
              'characterId must be a number string',
            ]);
        });
      });

      describe('relation not found', () => {
        beforeEach(() => {
          sandbox.stub(MovieCharacter, 'destroy').resolves(0);
        });

        it('should return a 404 status code - movie not found', async () => {
          sandbox.stub(Movie, 'findOne').resolves(null);

          const res = await request(app).delete('/movies/1/characters/1');

          expect(res.status).to.equal(HttpStatus.NOT_FOUND);

          expect(res.body).to.have.property('message', 'Movie not found.');
        });

        it('should return a 404 status code - character not found', async () => {
          sandbox
            .stub(Movie, 'findOne')
            .resolves(sandbox.createStubInstance(Movie));

          const res = await request(app).delete('/movies/1/characters/1');

          expect(res.status).to.equal(HttpStatus.NOT_FOUND);

          expect(res.body).to.have.property('message', 'Character not found.');
        });

        it('should return a 500 status code', async () => {
          sandbox.stub(Movie, 'findOne').rejects(new Error());

          const res = await request(app).delete('/movies/1/characters/1');

          expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
        });
      });
    });

    describe('unauthenticated', () => {
      beforeEach(() => {
        passportStub.yieldsAsync(null, null);
      });

      it('should return 401 status code', async () => {
        const res = await request(app).delete('/movies/1/characters/1');

        expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
