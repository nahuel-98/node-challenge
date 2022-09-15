import Migration from '../../models/types/migration.type';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    await sequelize.getQueryInterface().bulkInsert(
      'movies-characters',
      [
        { movieId: 1, characterId: 1 },
        { movieId: 1, characterId: 2 },
        { movieId: 2, characterId: 3 },
        { movieId: 3, characterId: 4 },
        { movieId: 3, characterId: 5 },
        { movieId: 4, characterId: 4 },
      ],
      { transaction },
    );
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    await sequelize
      .getQueryInterface()
      .bulkDelete('movies-characters', { transaction });
  });
};
