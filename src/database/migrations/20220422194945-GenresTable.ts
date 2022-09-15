import { col, fn, DataTypes } from 'sequelize';
import Migration from '../../models/types/migration.type';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.createTable(
      'genres',
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          autoIncrementIdentity: true,
        },
        name: DataTypes.STRING(30),
        imageUrl: DataTypes.STRING(2048),
      },
      {
        transaction,
      },
    );

    await queryInterface.addIndex('genres', {
      name: 'unique_name',
      unique: true,
      fields: [fn('lower', col('name'))],
      transaction,
    });
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  await sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('genres', 'unique_name', {
      transaction,
    });

    await queryInterface.dropTable('genres', { transaction });
  });
};
