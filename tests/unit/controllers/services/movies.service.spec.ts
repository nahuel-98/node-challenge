import { expect, use } from 'chai';
import { Op } from 'sequelize';
import { createSandbox, match, SinonSandbox, SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import Movie from '../../../../src/models/movie.model';
import MoviesService from '../../../../src/controllers/services/movies.service';
import FilterMovieDto from '../../../../src/models/dto/movies/filter-movie.dto';
import CreateMovieDto from '../../../../src/models/dto/movies/create-movie.dto';
import UpdateMovieDto from '../../../../src/models/dto/movies/update-movie.dto';
import MovieCharacter from '../../../../src/models/movie-character.model';

use(sinonChai);

describe('movies service tests', () => {
  let service: MoviesService, sandbox: SinonSandbox;

  before(() => {
    service = new MoviesService();
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAll', () => {
    let mockFindAndCountAll: SinonStub;

    beforeEach(() => {
      mockFindAndCountAll = sandbox
        .stub(Movie, 'findAndCountAll')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .resolves({ rows: [], count: 0 as any });
    });

    it('using all filter parameters', async () => {
      const dto: FilterMovieDto = {
        page: '3',
        limit: '5',
        order: 'DESC',
        genre: 1,
        title: 'star wars',
      };

      expect(await service.findAll(dto)).to.deep.equal({
        data: [],
        total: 0,
        totalPages: 0,
      });

      expect(mockFindAndCountAll).to.have.been.calledOnce;
      expect(mockFindAndCountAll).to.have.been.calledWithMatch({
        limit: 5,
        offset: 10,
        order: [['createdAt', 'DESC']],
        where: { [Op.and]: match.array.and(match.has('length', 2)) },
      });
    });

    it('empty parameters', async () => {
      await service.findAll({ order: 'ASC' });

      expect(mockFindAndCountAll).to.have.been.calledOnce;
      expect(mockFindAndCountAll).to.have.been.calledWithMatch({
        limit: 50,
        offset: 0,
        order: [['createdAt', 'ASC']],
        where: { [Op.and]: [] },
      });
    });
  });

  describe('findOne', () => {
    it('should call findByPk with the correct parameter', async () => {
      const mockFindByPk = sandbox.stub(Movie, 'findByPk').resolves(null);

      expect(await service.findOne(1)).to.be.null;

      expect(mockFindByPk).to.have.been.calledOnceWith(1);
    });
  });

  describe('create', () => {
    it('should call create with the correct arguments', async () => {
      const mockMovie = sandbox.createStubInstance(Movie),
        mockCreate = sandbox.stub(Movie, 'create').resolves(mockMovie);

      const dto: CreateMovieDto = { title: 'star wars', genreId: 1 };

      expect(await service.create(dto)).to.equal(mockMovie);
      expect(mockCreate).to.have.been.calledOnceWithExactly(dto);
    });
  });

  describe('update', () => {
    it('should return the updated movie', async () => {
      const mockMovie = sandbox.createStubInstance(Movie),
        mockFindByPk = sandbox.stub(Movie, 'findByPk').resolves(mockMovie);

      mockMovie.setAttributes.resolvesThis();
      mockMovie.save.resolvesThis();

      const dto: UpdateMovieDto = { title: 'star wars' };

      expect(await service.update(1, dto)).to.equal(mockMovie);

      expect(mockFindByPk).to.have.been.calledOnceWithExactly(1);
      expect(mockMovie.setAttributes).to.have.been.calledOnceWithExactly(dto);
      expect(mockMovie.save).to.have.been.calledOnce;
    });

    it('should return null', async () => {
      sandbox.stub(Movie, 'findByPk').resolves(null);

      expect(await service.update(1, {})).to.be.null;
    });
  });

  describe('delete', () => {
    it('should call destroy with the correct parameters', async () => {
      const mockDestroy = sandbox.stub(Movie, 'destroy').resolves(1);

      expect(await service.delete(1)).to.equal(1);
      expect(mockDestroy).to.have.been.called.calledOnceWithExactly({
        where: { id: 1 },
        limit: 1,
      });
    });
  });

  describe('addCharacter', () => {
    it('should return the created association', async () => {
      const mockMovieCharacter = sandbox.createStubInstance(MovieCharacter),
        mockCreate = sandbox
          .stub(MovieCharacter, 'create')
          .resolves(mockMovieCharacter);

      expect(await service.addCharacter(1, { characterId: 1 })).to.equal(
        mockMovieCharacter,
      );
      expect(mockCreate).to.have.been.calledOnceWithExactly({
        movieId: 1,
        characterId: 1,
      });
    });
  });

  describe('removeCharacter', () => {
    it('should return the number of deleted records', async () => {
      const mockDestroy = sandbox.stub(MovieCharacter, 'destroy').resolves(1);

      expect(await service.removeCharacter(1, 1)).to.equal(1);
      expect(mockDestroy).to.have.been.calledOnceWithExactly({
        where: {
          movieId: 1,
          characterId: 1,
        },
        limit: 1,
      });
    });
  });

  describe('exists', () => {
    it('should return true', async () => {
      sandbox
        .stub(Movie, 'findOne')
        .resolves(sandbox.createStubInstance(Movie));

      expect(await service.exists({ id: 1 })).to.be.true;
    });

    it('should return false', async () => {
      sandbox.stub(Movie, 'findOne').resolves(null);

      expect(await service.exists({ id: 1 })).to.be.false;
    });
  });
});
