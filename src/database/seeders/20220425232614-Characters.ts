import Migration from '../../models/types/migration.type';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    await sequelize.getQueryInterface().bulkInsert(
      'characters',
      [
        {
          name: 'Snow White',
          imageUrl:
            'https://static.wikia.nocookie.net/disney/images/3/33/Profile_-_Snow_White.jpeg/revision/latest/scale-to-width-down/782?cb=20200916135241',
          age: 14,
          weight: 53,
          history:
            "Snow White is a kind and gentle princess, with lips red as a rose and skin white as snow. After she's forced to leave her castle, she befriends the lovable Seven Dwarfs and finds her one true love.",
        },
        {
          name: 'Magic Mirror',
          imageUrl:
            'https://static.wikia.nocookie.net/disney/images/f/f9/Snowwhite-disneyscreencaps.com-100.jpg/revision/latest/scale-to-width-down/223?cb=20201125093643',
          history:
            'Not much is known about the mirror except that his sole purpose is to serve whoever may own him at the time. Whilst he is antagonistic on various occasions, he is not intentionally evil, as he is forced to obey the Evil Queen due to being her slave. He does not hesitate to tell the truth to the Queen when it is revealed that Snow White was still alive.',
        },
        {
          name: 'Phineas Flynn',
          imageUrl:
            'https://static.wikia.nocookie.net/phineasandferb/images/e/ea/Profile_-_Phineas_Flynn.PNG/revision/latest/scale-to-width-down/350?cb=20200401182458',
          age: 12,
          weight: 44,
          history:
            'Phineas Flynn is a young boy in the Flynn-Fletcher family. He is the son of Linda Flynn-Fletcher and step-son of Lawrence Fletcher. He is one of the three children of the Flynn-Fletcher household, along with his sister Candace and step-brother Ferb. He shares a strong bond with the family pet, Perry the Platypus, but remains unaware of his double life as a secret agent.',
        },
        {
          name: 'Darth Vader',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/3/32/Star_Wars_-_Darth_Vader.jpg',
          age: 45,
          weight: 105,
          history:
            'Originally a slave on Tatooine, Anakin Skywalker is a Jedi prophesied to bring balance to the Force. He is lured to the dark side of the Force by Chancellor Sheev Palpatine / Darth Sidious and becomes a Sith Lord, assuming the title of Darth Vader. After a lightsaber battle with his former mentor Obi-Wan Kenobi on Mustafar, in which he is severely injured, Vader is transformed into a cyborg. He then serves the Galactic Empire for over two decades as its chief enforcer. Vader ultimately redeems himself by saving his son, Luke Skywalker, and killing Palpatine, sacrificing his own life in the process.',
        },
        {
          name: 'Luke Skywalker',
          imageUrl:
            'https://static.wikia.nocookie.net/esstarwars/images/d/d9/Luke-rotjpromo.jpg/revision/latest/scale-to-width-down/350?cb=20071214134433',
          age: 22,
          weight: 73,
          history:
            "Originally a farmer on Tatooine living with his uncle and aunt, Luke becomes a pivotal figure in the Rebel Alliance's struggle against the Galactic Empire.The son of fallen Jedi Knight Anakin Skywalker(turned Sith Lord Darth Vader) and Padmé Amidala, Luke is the twin brother of Rebellion leader Princess Leia and eventual brother-in -law of the smuggler Han Solo.Luke trains to be a Jedi under Jedi Masters Obi - Wan Kenobi and Yoda and rebuilds the Jedi Order.",
        },
      ],
      { transaction },
    );
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    await sequelize
      .getQueryInterface()
      .bulkDelete('characters', {}, { transaction });
  });
};
