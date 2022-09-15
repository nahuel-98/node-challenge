import { DataTypes } from 'sequelize';
import Migration from '../../models/types/migration.type';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    await sequelize.getQueryInterface().createTable(
      'movies',
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          autoIncrementIdentity: true,
        },
        title: DataTypes.STRING(100),
        imageUrl: DataTypes.STRING(2048),
        genreId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'genres',
            key: 'id',
          },
        },
        rating: DataTypes.DECIMAL(2, 1),
        createdAt: DataTypes.DATE,
      },
      { transaction },
    );
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    await sequelize.getQueryInterface().dropTable('movies', { transaction });
  });
};
