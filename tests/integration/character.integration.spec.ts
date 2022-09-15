import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import passport from 'passport';
import {
  createSandbox,
  SinonSandbox,
  SinonStub,
  SinonStubbedInstance,
} from 'sinon';
import app from '../../src/express';
import Character from '../../src/models/character.model';
import HttpStatus from '../../src/models/enums/http-status.enum';
import User from '../../src/models/user.model';

use(chaiHttp);

describe('characters integration tests', () => {
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

  describe('/characters', () => {
    describe('get', () => {
      it('should return 200 status code', async () => {
        sandbox
          .stub(Character, 'findAndCountAll')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .resolves({ rows: [], count: 0 as any }); // overloads dont work for some reason

        const res = await request(app).get('/characters');

        expect(res.status).to.equal(HttpStatus.OK);
        expect(res.body).to.deep.equal({
          data: [],
          total: 0,
          totalPages: 0,
        });
      });

      it('should return 500 status code', async () => {
        sandbox.stub(Character, 'findAndCountAll').rejects(new Error());

        const res = await request(app).get('/characters');

        expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });

    describe('post', () => {
      const body = { name: 'Simba' };

      describe('authenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, { id: 1, email: 'abc@gmail.com' });
        });

        it('should return 201 status code', async () => {
          const mockCharacter = sandbox.createStubInstance(Character);
          mockCharacter.id = 1;

          sandbox.stub(Character, 'create').resolves(mockCharacter);

          const res = await request(app).post('/characters').send(body);

          expect(res.status).to.equal(HttpStatus.CREATED);
        });

        it('should return 400 status code', async () => {
          const res = await request(app)
            .post('/characters')
            .send({ name: 123 });

          expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

          expect(res.body)
            .to.have.property('message')
            .that.has.property('errors')
            .and.contains.members(['name must be a string']);
        });

        it('should return 500 status code', async () => {
          sandbox.stub(Character, 'create').rejects(new Error());

          const res = await request(app).post('/characters').send(body);

          expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
        });
      });

      describe('unauthenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, null);
        });

        it('should return 401 status code', async () => {
          const res = await request(app).post('/characters').send(body);

          expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
        });
      });
    });
  });

  describe('/characters/:id', () => {
    describe('get', () => {
      it('should return 200 status code with a character', async () => {
        const mockCharacter = sandbox.createStubInstance(Character);
        mockCharacter.id = 1;
        mockCharacter.name = 'Simba';
        mockCharacter.age = 4;
        mockCharacter.weight = 235;
        mockCharacter.history = 'This is a placeholder';
        mockCharacter.imageUrl = 'https://abcdef.com/image.png';
        mockCharacter.movies = [];

        sandbox.stub(Character, 'findByPk').resolves(mockCharacter);

        const res = await request(app).get('/characters/1');

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body).to.deep.equal({
          id: 1,
          name: 'Simba',
          age: 4,
          weight: 235,
          history: 'This is a placeholder',
          imageUrl: 'https://abcdef.com/image.png',
          movies: [],
        });
      });

      it('should return a 400 status code', async () => {
        const res = await request(app).get('/characters/abc');

        expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

        expect(res.body)
          .to.have.property('message')
          .that.has.deep.property('errors', ['id must be a number string']);
      });

      it('should return a 404 status code', async () => {
        sandbox.stub(Character, 'findByPk').resolves(null);

        const res = await request(app).get('/characters/1');

        expect(res.status).to.equal(HttpStatus.NOT_FOUND);
      });

      it('should return a 500 status code', async () => {
        sandbox.stub(Character, 'findByPk').rejects(new Error());

        const res = await request(app).get('/characters/1');

        expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });

    describe('patch', () => {
      const body = { imageUrl: 'https://test.com/image.png' };

      describe('authenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, { id: 1, email: 'abc@gmail.com' });
        });

        describe('character found', () => {
          let mockCharacter: SinonStubbedInstance<Character>;

          beforeEach(() => {
            mockCharacter = sandbox.createStubInstance(Character);

            sandbox.stub(Character, 'findByPk').resolves(mockCharacter);
            mockCharacter.save.resolves(mockCharacter);
          });

          it('should return 200 status code', async () => {
            const res = await request(app).patch('/characters/1').send(body);

            expect(res.status).to.equal(HttpStatus.OK);
          });

          it('should return 400 status code', async () => {
            const res = await request(app)
              .patch('/characters/1')
              .send({ imageUrl: 'abc' });

            expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

            expect(res.body)
              .to.have.property('message')
              .that.has.deep.property('errors', [
                'imageUrl must be an URL address',
              ]);
          });

          it('should return 500 status code', async () => {
            mockCharacter.save.rejects(new Error());

            const res = await request(app).patch('/characters/1').send(body);

            expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
          });
        });

        describe('character not found', () => {
          beforeEach(() => {
            sandbox.stub(Character, 'findByPk').resolves(null);
          });

          it('should return a 404 status code', async () => {
            const res = await request(app).patch('/characters/1').send(body);

            expect(res.status).to.equal(HttpStatus.NOT_FOUND);
          });
        });
      });

      describe('unauthenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, null);
        });

        it('should return 401 status code', async () => {
          const res = await request(app).patch('/characters/1').send(body);

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
          sandbox.stub(Character, 'destroy').resolves(1);

          const res = await request(app).delete('/characters/1');

          expect(res.status).to.equal(HttpStatus.OK);
        });

        it('should return a 400 status code', async () => {
          const res = await request(app).delete('/characters/abc');

          expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

          expect(res.body)
            .to.have.property('message')
            .that.has.deep.property('errors', ['id must be a number string']);
        });

        it('should return a 404 status code', async () => {
          sandbox.stub(Character, 'destroy').resolves(0);

          const res = await request(app).delete('/characters/1');

          expect(res.status).to.equal(HttpStatus.NOT_FOUND);
        });

        it('should return a 500 status code', async () => {
          sandbox.stub(Character, 'destroy').rejects(new Error());

          const res = await request(app).delete('/characters/1');

          expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
        });
      });

      describe('unauthenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, null);
        });

        it('should return 401 status code', async () => {
          const res = await request(app).delete('/characters/1');

          expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
        });
      });
    });
  });
});
