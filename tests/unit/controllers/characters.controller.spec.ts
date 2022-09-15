import { expect, use } from 'chai';
import { createStubInstance, match, SinonStubbedInstance, stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import Character from '../../../src/models/character.model';
import CharactersController from '../../../src/controllers/characters.controller';
import CharactersService from '../../../src/controllers/services/characters.service';
import HttpStatus from '../../../src/models/enums/http-status.enum';
import HttpError from '../../../src/errors/http.error';

use(sinonChai);

describe('characters controller tests', () => {
  const res = mockRes(),
    next = stub();

  let controller: CharactersController,
    service: SinonStubbedInstance<CharactersService>;

  beforeEach(() => {
    service = createStubInstance(CharactersService);

    controller = new CharactersController(service);
  });

  afterEach(() => {
    res.status.resetHistory();
    res.json.resetHistory();
    next.resetHistory();
  });

  describe('findAll', () => {
    const query = { page: '1', limit: '1' };
    const req = mockReq({ query });

    it('should return characters list', async () => {
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

    it('should return a character', async () => {
      const character = createStubInstance(Character);
      character.id = 1;
      character.name = 'Simba';
      character.movies = [];

      service.findOne.resolves(character);

      await controller.findOne(req, res, next);

      expect(service.findOne).to.have.been.calledOnceWithExactly(1);
      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.OK);
      expect(res.json).callCount(1);
      expect(res.json).to.have.been.calledWithMatch({
        id: 1,
        name: 'Simba',
        movies: [],
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
    const req = mockReq({ body: { name: 'Simba' } });

    it('should return id of the created character', async () => {
      const character = createStubInstance(Character);
      character.id = 1;
      character.name = 'Simba';

      service.create.resolves(character);

      await controller.create(req, res, next);

      expect(service.create).to.have.been.calledOnceWithExactly({
        name: 'Simba',
      });
      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.CREATED);
      expect(res.json).to.have.been.calledOnceWithExactly({ id: 1 });
    });

    it('should call next with error', async () => {
      const err = new Error();
      service.create.rejects(err);

      await controller.create(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(err);
    });
  });

  describe('update', () => {
    const req = mockReq({ params: { id: 1 }, body: { name: 'Simba' } });

    it('should return a success message', async () => {
      const character = createStubInstance(Character);
      character.id = 1;
      character.name = 'Simba';

      service.update.resolves(character);

      await controller.update(req, res, next);

      expect(service.update).to.have.been.calledOnceWithExactly(1, {
        name: 'Simba',
      });
      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.OK);
      expect(res.json).to.have.been.calledOnceWithExactly({
        message: 'Character updated.',
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
        message: 'Character deleted.',
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
});
