import { expect, use } from 'chai';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';
import sgMail from '@sendgrid/mail';
import logger from '../../../../src/logger';
import MailService from '../../../../src/controllers/services/mail.service';

use(sinonChai);

describe('mail service tests', () => {
  stub(sgMail, 'setApiKey').returns();

  const service = new MailService();

  const sendStub = stub(sgMail, 'send'),
    errLogStub = stub(logger, 'error');

  afterEach(() => {
    sendStub.reset();
    errLogStub.resetHistory();
  });

  it('should send mail', async () => {
    sendStub.resolves();

    await service.send('abc@domain.com');

    expect(errLogStub).to.not.have.been.called;
  });

  it('should log error', async () => {
    const err = new Error();
    sendStub.rejects(err);

    await service.send('abc@domain.com');

    expect(errLogStub).to.have.been.calledOnceWithExactly(err);
  });
});
