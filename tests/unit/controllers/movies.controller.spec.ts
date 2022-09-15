import { expect, use } from 'chai';
import { createStubInstance, match, SinonStubbedInstance, stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import Movie from '../../../src/models/movie.model';
import MovieCharacter from '../../../src/models/movie-character.model';
import MoviesController from '../../../src/controllers/movies.controller';
import MoviesService from '../../../src/controllers/services/movies.service';
import Genre from '../../../src/models/genre.model';
import HttpError from '../../../src/errors/http.error';
import HttpStatus from '../../../src/models/enums/http-status.enum';

use(sinonChai);

describe('movies controller tests', () => {
  const res = mockRes(),
    next = stub();

  let controller: MoviesController,
    service: SinonStubbedInstance<MoviesService>;

  const mockMovie = createStubInstance(Movie);
  mockMovie.id = 1;
  mockMovie.title = 'The Lion King';
  mockMovie.genreId = 1;
  mockMovie.genre = createStubInstance(Genre);
  mockMovie.genre.id = 1;
  mockMovie.genre.name = 'Drama';
  mockMovie.createdAt = new Date('2022-01-01T00:00:00.000Z');
  mockMovie.characters = [];

  beforeEach(() => {
    service = createStubInstance(MoviesService);

    controller = new MoviesController(service);
  });

  afterEach(() => {
    res.status.resetHistory();
    res.json.resetHistory();
    next.resetHistory();
  });

  describe('findAll', () => {
    const query = { page: '1', limit: '1' };
    const req = mockReq({ query });

    it('should return movies list', async () => {
      const paginationResult = { data: [], totalPages: 0, total: 0 };
      service.findAll.resolves(paginationResult);

      await controller.findAll(req, res, next);

      expect(service.findAll).to.have.been.calledOnceWithExactly(query);
      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.OK);
      expect(res.json).to.have.been.calledOnceWithExactly(paginationResult);
    });

    it('should call next middleware on error', async () => {
      const err = new Error();
      service.findAll.rejects(err);

      await controller.findAll(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(err);
    });
  });

  describe('findOne', () => {
    const params = { id: '1' };
    const req = mockReq({ params });

    it('should return a movie', async () => {
      service.findOne.resolves(mockMovie);

      await controller.findOne(req, res, next);

      expect(service.findOne).to.have.been.calledOnceWithExactly(1);
      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.OK);
      expect(res.json).callCount(1);
      expect(res.json).to.have.been.calledWithMatch({
        id: 1,
        title: 'The Lion King',
        genre: {
          id: 1,
          name: 'Drama',
        },
        createdAt: match.date,
        characters: [],
      });
    });

    it('should call next with 404 error', async () => {
      service.findOne.resolves(null);

      await controller.findOne(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(
        match
          .instanceOf(HttpError)
          .and(match.has('status', HttpStatus.NOT_FOUND)),
      );
    });

    it('should call next with error', async () => {
      const err = new Error();
      service.findOne.rejects(err);

      await controller.findOne(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(err);
    });
  });

  describe('create', () => {
    const body = { title: 'The Lion King', genreId: 1 };
    const req = mockReq({ body });

    it('should return id of the created movie', async () => {
      service.create.resolves(mockMovie);

      await controller.create(req, res, next);

      expect(service.create).to.have.been.calledOnceWithExactly(body);
      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.CREATED);
      expect(res.json).to.have.been.calledOnceWithExactly({ id: 1 });
    });

    it('should return 422 error on bad genre id', async () => {
      service.create.rejects(new ForeignKeyConstraintError({}));

      await controller.create(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(
        match
          .instanceOf(HttpError)
          .and(match.has('status', HttpStatus.UNPROCESSABLE_ENTITY)),
      );
    });

    it('should call next with error', async () => {
      const err = new Error();
      service.create.rejects(err);

      await controller.create(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(err);
    });
  });

  describe('update', () => {
    const body = { title: 'The Lion King', genreId: 1 },
      params = { id: 1 };
    const req = mockReq({ body, params });

    it('should return a success message', async () => {
      service.update.resolves(mockMovie);

      await controller.update(req, res, next);

      expect(service.update).to.have.been.calledOnceWithExactly(1, body);
      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.OK);
      expect(res.json).to.have.been.calledOnceWithExactly({
        message: 'Movie updated.',
      });
    });

    it('should call next with 404 error', async () => {
      service.update.resolves(null);

      await controller.update(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(
        match
          .instanceOf(HttpError)
          .and(match.has('status', HttpStatus.NOT_FOUND)),
      );
    });

    it('should return 422 error on bad genre id', async () => {
      service.update.rejects(new ForeignKeyConstraintError({}));

      await controller.update(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(
        match
          .instanceOf(HttpError)
          .and(match.has('status', HttpStatus.UNPROCESSABLE_ENTITY)),
      );
    });

    it('should call next with error', async () => {
      const err = new Error();
      service.update.rejects(err);

      await controller.update(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(err);
    });
  });

  describe('delete', () => {
    const req = mockReq({ params: { id: 1 } });

    it('should return a success message', async () => {
      service.delete.resolves(1);

      await controller.delete(req, res, next);

      expect(service.delete).to.have.been.calledOnceWithExactly(1);
      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.OK);
      expect(res.json).to.have.been.calledOnceWithExactly({
        message: 'Movie deleted.',
      });
    });

    it('should call next with 404 error', async () => {
      service.delete.resolves(0);

      await controller.delete(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(
        match
          .instanceOf(HttpError)
          .and(match.has('status', HttpStatus.NOT_FOUND)),
      );
    });

    it('should call next with error', async () => {
      const err = new Error();
      service.delete.rejects(err);

      await controller.delete(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(err);
    });
  });

  describe('addCharacter', () => {
    const params = { id: '1' },
      body = { characterId: 1 };
    const req = mockReq({ params, body });

    describe('movie found', () => {
      beforeEach(() => {
        service.exists.resolves(true);
      });

      it('should return success response', async () => {
        service.addCharacter.resolves(createStubInstance(MovieCharacter));

        await controller.addCharacter(req, res, next);

        expect(service.exists).to.have.been.calledOnceWithExactly({ id: 1 });
        expect(service.addCharacter).to.have.been.calledOnceWithExactly(
          1,
          body,
        );
        expect(res.status).to.have.been.calledOnceWithExactly(
          HttpStatus.CREATED,
        );
      });

      it('character already in movie - should call next with 409 error', async () => {
        service.addCharacter.rejects(new UniqueConstraintError({}));

        await controller.addCharacter(req, res, next);

        expect(next).to.have.been.calledOnceWithExactly(
          match
            .instanceOf(HttpError)
            .and(match.has('status', HttpStatus.CONFLICT)),
        );
      });

      it('character does not exist - call next with 422 error', async () => {
        service.addCharacter.rejects(new ForeignKeyConstraintError({}));

        await controller.addCharacter(req, res, next);

        expect(next).to.have.been.calledOnceWithExactly(
          match
            .instanceOf(HttpError)
            .and(match.has('status', HttpStatus.UNPROCESSABLE_ENTITY)),
        );
      });
    });

    describe('movie not found', () => {
      beforeEach(() => {
        service.exists.resolves(false);
      });

      it('should call next with 404 error', async () => {
        await controller.addCharacter(req, res, next);

        expect(next).to.have.been.calledOnceWithExactly(
          match
            .instanceOf(HttpError)
            .and(match.has('status', HttpStatus.NOT_FOUND)),
        );
      });
    });

    describe('error', () => {
      const err = new Error();

      beforeEach(() => {
        service.exists.rejects(err);
      });

      it('should call next with error', async () => {
        await controller.addCharacter(req, res, next);

        expect(next).to.have.been.calledOnceWithExactly(err);
      });
    });
  });

  describe('removeCharacter', () => {
    const req = mockReq({ params: { movieId: '1', characterId: '1' } });

    describe('record deleted', () => {
      beforeEach(() => {
        service.removeCharacter.resolves(1);
      });

      it('should return 200 response', async () => {
        await controller.removeCharacter(req, res, next);

        expect(service.removeCharacter).to.have.been.calledOnceWithExactly(
          1,
          1,
        );
        expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.OK);
      });
    });

    describe('record not deleted', () => {
      beforeEach(() => {
        service.removeCharacter.resolves(0);
      });

      it('movie does not exist', async () => {
        service.exists.resolves(false);

        await controller.removeCharacter(req, res, next);

        expect(next).to.have.been.calledOnceWithExactly(
          match.instanceOf(HttpError).and(
            match({
              status: HttpStatus.NOT_FOUND,
              response: 'Movie not found.',
            }),
          ),
        );
      });

      it('character does not exist', async () => {
        service.exists.resolves(true);

        await controller.removeCharacter(req, res, next);

        expect(next).to.have.been.calledOnceWithExactly(
          match.instanceOf(HttpError).and(
            match({
              status: HttpStatus.NOT_FOUND,
              response: 'Character not found.',
            }),
          ),
        );
      });
    });

    describe('error', () => {
      const err = new Error();

      beforeEach(() => {
        service.removeCharacter.rejects(err);
      });

      it('should call next with error', async () => {
        await controller.removeCharacter(req, res, next);

        expect(next).to.have.been.calledOnceWithExactly(err);
      });
    });
  });
});
