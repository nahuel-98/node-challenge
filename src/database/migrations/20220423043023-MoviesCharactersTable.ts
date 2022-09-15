import { DataTypes } from 'sequelize';
import Migration from '../../models/types/migration.type';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.createTable(
      'movies-characters',
      {
        movieId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'movies',
            key: 'id',
          },
        },
        characterId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'characters',
            key: 'id',
          },
        },
      },
      { transaction },
    );

    await queryInterface.addConstraint('movies-characters', {
      name: 'movies-characters_pkey',
      type: 'primary key',
      fields: ['movieId', 'characterId'],
      transaction,
    });
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.removeConstraint(
      'movies-characters',
      'movies-characters_pkey',
      {
        transaction,
      },
    );

    await queryInterface.dropTable('movies-characters', { transaction });
  });
};
