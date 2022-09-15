import { col, fn, DataTypes } from 'sequelize';
import Migration from '../../models/types/migration.type';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.createTable(
      'users',
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          autoIncrementIdentity: true,
        },
        email: {
          type: DataTypes.STRING(320),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      { transaction },
    );

    await queryInterface.addIndex('users', {
      name: 'email_idx',
      unique: true,
      fields: [fn('lower', col('email'))],
      transaction,
    });
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.removeIndex('users', 'email_idx', { transaction });

    await queryInterface.dropTable('users', { transaction });
  });
};
