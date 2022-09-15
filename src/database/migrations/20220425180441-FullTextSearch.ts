import { col, fn } from 'sequelize';
import Migration from '../../models/types/migration.type';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.addIndex('characters', {
      name: 'name_idx',
      fields: [fn('to_tsvector', 'english', col('name'))],
      using: 'gin',
      transaction,
    });

    await queryInterface.addIndex('movies', {
      name: 'title_idx',
      fields: [fn('to_tsvector', 'english', col('title'))],
      using: 'gin',
      transaction,
    });
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.removeIndex('movies', 'title_idx', { transaction });

    await queryInterface.removeIndex('characters', 'name_idx', {
      transaction,
    });
  });
};
