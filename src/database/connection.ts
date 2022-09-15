import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';
import dbConfig from '../config/db.config';

/**
 * Stores the database connection in the DI container
 */
@Service()
export default class DbConnection {
  private connection: Sequelize;

  constructor() {
    this.connection = new Sequelize(dbConfig);
  }

  getConnection() {
    return this.connection;
  }
}
