import Migration from '../../models/types/migration.type';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    await sequelize.getQueryInterface().bulkInsert(
      'movies',
      [
        {
          title: 'Snow White and the Seven Dwarfs',
          genreId: 7,
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/b/b0/Snow_white_1937_trailer_screenshot.jpg',
          rating: 4.3,
          createdAt: new Date(1937, 12, 21),
        },
        {
          title: 'Phineas and Ferb',
          genreId: 3,
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Phineas_and_Ferb_Meet_%26_Greet_Sign.jpg/1024px-Phineas_and_Ferb_Meet_%26_Greet_Sign.jpg',
          rating: 3.8,
          createdAt: new Date(2007, 8, 17),
        },
        {
          title: 'Star Wars: Episode V - The Empire Strikes Back',
          genreId: 12,
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/en/3/3f/The_Empire_Strikes_Back_%281980_film%29.jpg',
          rating: 4.4,
          createdAt: new Date(1980, 5, 21),
        },
        {
          title: 'Rogue One: A Star Wars Story',
          genreId: 12,
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Rogue_One%2C_A_Star_Wars_Story_poster.png/220px-Rogue_One%2C_A_Star_Wars_Story_poster.png',
          rating: 4.0,
          createdAt: new Date(2016, 12, 16),
        },
      ],
      {
        transaction,
      },
    );
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    await sequelize
      .getQueryInterface()
      .bulkDelete('movies', {}, { transaction });
  });
};
