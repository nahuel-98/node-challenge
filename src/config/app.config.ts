/**
 * Gets the app config from environment variables.
 */
const appConfig = {
  ENVIRONMENT: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'default',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  SENDGRID_EMAIL: process.env.SENDGRID_EMAIL || '',
};

export default appConfig;
