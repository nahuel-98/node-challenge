import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';
import { SequelizeStorage, Umzug } from 'umzug';
import logger from '../logger';
import DbConnection from './connection';

/**
 * Factory for umzug instances.
 */
@Service()
export default class UmzugFactory {
  private sequelize: Sequelize;

  constructor(dbConnection: DbConnection) {
    this.sequelize = dbConnection.getConnection();
  }

  /**
   * Returns an instance of umzug using the projects database,
   * using the provided glob pattern to localize migration files.
   *
   * @param glob Glob pattern to localize migration files.
   * @example const umzug = createUmzug('migrations/*.ts')
   */
  create(glob: string) {
    return new Umzug({
      migrations: {
        glob: [glob, { cwd: __dirname }],
      },
      context: this.sequelize,
      storage: new SequelizeStorage({
        sequelize: this.sequelize,
      }),
      logger,
    });
  }
}
