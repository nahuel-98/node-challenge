import { MailService } from '@sendgrid/mail';
import { expect, use } from 'chai';
import { Express } from 'express';
import { noCallThru } from 'proxyquire';
import { createStubInstance } from 'sinon';
import sinonChai from 'sinon-chai';

use(sinonChai);

const proxyquire = noCallThru();

describe('express function tests', () => {
  const mockMailService = createStubInstance(MailService);

  const app: Express = proxyquire('../../src/express', {
    typedi: {
      Container: {
        get: () => mockMailService,
        import: function () {
          return this;
        },
        getMany: () => [],
      },
    },
  }).default;

  it('should listen to event', () => {
    app.emit('event:userCreated', 'abc@def.com');

    expect(mockMailService.send).to.have.been.calledOnceWithExactly(
      'abc@def.com',
    );
  });
});
