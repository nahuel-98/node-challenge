import { Sequelize } from 'sequelize-typescript';
import { MigrationParams } from 'umzug';

/**
 * Sequelize migration or seeder up/down function.
 */
type Migration = (params: MigrationParams<Sequelize>) => Promise<unknown>;

export default Migration;
