import sgMail from '@sendgrid/mail';
import { Service } from 'typedi';
import appConfig from '../../config/app.config';
import logger from '../../logger';

/**
 * Service for sending emails.
 */
@Service()
export default class MailService {
  constructor() {
    sgMail.setApiKey(appConfig.SENDGRID_API_KEY);
  }

  /**
   * Sends an email to an address
   */
  async send(email: string): Promise<void> {
    try {
      await sgMail.send({
        from: appConfig.SENDGRID_EMAIL,
        to: email,
        subject: 'Welcome to Movies API',
        text: 'Welcome to Movies API! Log in at POST /auth/login and get your access token.',
        html: '<p>Welcome to <strong>Movies API</strong>! Log in at <code>POST /auth/login</code> and get your access token.</p>',
      });
    } catch (err) {
      logger.error(err);
    }
  }
}
