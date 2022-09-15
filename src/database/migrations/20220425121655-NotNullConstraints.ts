import { DataTypes } from 'sequelize';
import Migration from '../../models/types/migration.type';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.changeColumn(
      'characters',
      'name',
      {
        allowNull: false,
        type: DataTypes.STRING(30),
      },
      {
        transaction,
      },
    );

    await queryInterface.changeColumn(
      'genres',
      'name',
      {
        allowNull: false,
        type: DataTypes.STRING(30),
      },
      {
        transaction,
      },
    );

    await queryInterface.changeColumn(
      'movies',
      'title',
      {
        allowNull: false,
        type: DataTypes.STRING(100),
      },
      {
        transaction,
      },
    );
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.changeColumn(
      'characters',
      'name',
      {
        allowNull: true,
        type: DataTypes.STRING(30),
      },
      {
        transaction,
      },
    );

    await queryInterface.changeColumn(
      'genres',
      'name',
      {
        allowNull: true,
        type: DataTypes.STRING(30),
      },
      {
        transaction,
      },
    );

    await queryInterface.changeColumn(
      'movies',
      'title',
      {
        allowNull: true,
        type: DataTypes.STRING(100),
      },
      {
        transaction,
      },
    );
  });
};
