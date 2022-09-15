import { DataTypes } from 'sequelize';
import Migration from '../../models/types/migration.type';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    await sequelize.getQueryInterface().createTable(
      'characters',
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
        age: DataTypes.INTEGER,
        weight: DataTypes.INTEGER,
        history: DataTypes.STRING(1000),
      },
      { transaction },
    );
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    await sequelize
      .getQueryInterface()
      .dropTable('characters', { transaction });
  });
};
