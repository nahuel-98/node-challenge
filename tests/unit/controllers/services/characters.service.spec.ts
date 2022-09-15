import { expect, use } from 'chai';
import { Op } from 'sequelize';
import { createSandbox, match, SinonSandbox, SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import CharactersService from '../../../../src/controllers/services/characters.service';
import Character from '../../../../src/models/character.model';
import CreateCharacterDto from '../../../../src/models/dto/characters/create-character.dto';
import FilterCharacterDto from '../../../../src/models/dto/characters/filter-character.dto';

use(sinonChai);

describe('characters service tests', () => {
  let service: CharactersService, sandbox: SinonSandbox;

  before(() => {
    service = new CharactersService();
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAll', () => {
    let mockFindAndCountAll: SinonStub;

    beforeEach(() => {
      mockFindAndCountAll = sandbox
        .stub(Character, 'findAndCountAll')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .resolves({ rows: [], count: 0 as any }); // overload does not work
    });

    it('dto has all possible parameters', async () => {
      const dto: FilterCharacterDto = {
        limit: '1',
        page: '1',
        name: 'simba',
        age: { gt: 3 },
        weight: { lt: 200 },
        movies: [1],
      };

      expect(await service.findAll(dto)).to.deep.equal({
        data: [],
        total: 0,
        totalPages: 0,
      });

      expect(mockFindAndCountAll).to.have.been.calledOnce;
      expect(mockFindAndCountAll).to.have.been.calledWithMatch({
        limit: 1,
        offset: 0,
        where: { [Op.and]: match.array.and(match.has('length', 4)) },
      });
    });

    it('empty parameters', async () => {
      await service.findAll({});

      expect(mockFindAndCountAll).to.have.been.calledOnce;
      expect(mockFindAndCountAll).to.have.been.calledWithMatch({
        limit: 50,
        offset: 0,
        where: { [Op.and]: [] },
      });
    });
  });

  describe('findOne', () => {
    it('should call findByPk with the correct parameter', async () => {
      const mockFindByPk = sandbox.stub(Character, 'findByPk').resolves(null);

      expect(await service.findOne(1)).to.be.null;

      expect(mockFindByPk).to.have.been.calledOnceWith(1);
    });
  });

  describe('create', () => {
    it('should call Character.create with the correct arguments', async () => {
      const mockCharacter = sandbox.createStubInstance(Character),
        mockCreate = sandbox.stub(Character, 'create').resolves(mockCharacter);

      const dto: CreateCharacterDto = { name: 'simba' };

      expect(await service.create(dto)).to.equal(mockCharacter);
      expect(mockCreate).to.have.been.calledOnceWithExactly(dto);
    });
  });

  describe('update', () => {
    it('should return the updated character', async () => {
      const mockCharacter = sandbox.createStubInstance(Character),
        mockFindByPk = sandbox
          .stub(Character, 'findByPk')
          .resolves(mockCharacter);

      mockCharacter.setAttributes.resolvesThis();
      mockCharacter.save.resolvesThis();

      const dto = { name: 'simba' };

      expect(await service.update(1, dto)).to.equal(mockCharacter);

      expect(mockFindByPk).to.have.been.calledOnceWithExactly(1);
      expect(mockCharacter.setAttributes).to.have.been.calledOnceWithExactly(
        dto,
      );
      expect(mockCharacter.save).to.have.been.calledOnce;
    });

    it('should return null', async () => {
      sandbox.stub(Character, 'findByPk').resolves(null);

      expect(await service.update(1, {})).to.be.null;
    });
  });

  describe('delete', () => {
    it('should call Character.destroy with the correct parameters', async () => {
      const mockDestroy = sandbox.stub(Character, 'destroy').resolves(1);

      expect(await service.delete(1)).to.equal(1);
      expect(mockDestroy).to.have.been.called.calledOnceWithExactly({
        where: { id: 1 },
        limit: 1,
      });
    });
  });
});
