import Migration from '../../models/types/migration.type';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    await sequelize.getQueryInterface().bulkInsert(
      'genres',
      [
        {
          name: 'Action',
          imageUrl:
            'https://images.assetsdelivery.com/compings_v2/nyul/nyul1408/nyul140800116.jpg',
        },
        {
          name: 'Adventure',
          imageUrl:
            'https://thumbs.dreamstime.com/b/explorer-jungle-binoculars-expert-looking-away-47546059.jpg',
        },
        {
          name: 'Comedy',
          imageUrl:
            'https://media.istockphoto.com/photos/-picture-id1186127120?k=20&m=1186127120&s=612x612&w=0&h=tP4SfKBuWFUJLqQ5f8gYe4tTRuEFxQqwHRF4NKHo1p4=',
        },
        {
          name: 'Crime',
          imageUrl:
            'https://media.istockphoto.com/photos/crime-scene-tape-barrier-in-front-of-defocused-background-picture-id1059636358?k=20&m=1059636358&s=612x612&w=0&h=Op9rPF_M3jekeypLcYZH3mplaSA5YPkJ-mtyoOGOe3w=',
        },
        {
          name: 'Documental',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/a/ad/BolexH16.jpg',
        },
        {
          name: 'Drama',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Drama_Masks.svg/490px-Drama_Masks.svg.png?20170914100945',
        },
        {
          name: 'Fantasy',
          imageUrl:
            'https://st.depositphotos.com/1956729/1826/i/600/depositphotos_18265217-stock-photo-alien-world-in-winter.jpg',
        },
        {
          name: 'Horror',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUqTwb0WPQhkvWvJLCPL9jR4LIQQYT42V-eA&usqp=CAU',
        },
        {
          name: 'Mistery',
          imageUrl:
            'https://media.istockphoto.com/photos/detective-spying-picture-id153752556?k=20&m=153752556&s=612x612&w=0&h=E_kLh9Bhf4nRIQIvwzirDZaW5tBiMFoY78wk0vo9Afo=',
        },
        {
          name: 'Musical',
          imageUrl:
            'https://thumbs.dreamstime.com/b/children-group-playing-music-instruments-kids-musical-band-over-white-background-148626425.jpg',
        },
        {
          name: 'Romance',
          imageUrl:
            'https://data.whicdn.com/images/357322984/original.jpg?t=1627638087',
        },
        {
          name: 'Science-Fiction',
          imageUrl:
            'https://media.istockphoto.com/photos/futuristic-scifi-battle-ships-hover-over-an-alien-planet-picture-id1277822133?k=20&m=1277822133&s=612x612&w=0&h=39Gi-s4f2TBeUPnukbSiLG0gabkon7UyhP4gd3eufdE=',
        },
        {
          name: 'Slice of life',
          imageUrl:
            'https://image.shutterstock.com/image-photo/three-young-female-friends-sitting-260nw-2058160484.jpg',
        },
        {
          name: 'Sports',
          imageUrl:
            'https://domosportsgrass.com/sites/default/files/styles/image_style_14_10_landscape_lg/public/p012/2019-06/Soccer%20-%20Domo%20Sports%20Grass_0.jpg?h=feece8c8&itok=-FoHES_g',
        },
        {
          name: 'Thriller',
          imageUrl:
            'https://media.istockphoto.com/photos/sad-man-alone-walking-along-the-alley-in-night-foggy-park-back-view-picture-id1203073646?k=20&m=1203073646&s=612x612&w=0&h=XI69_ky8KJhnGPfuT3ZShPTolbfgIwi7IsxRfAMRzQM=',
        },
        {
          name: 'War',
          imageUrl:
            'https://media.istockphoto.com/photos/marines-in-action-desert-sandstorm-picture-id947295886?k=20&m=947295886&s=612x612&w=0&h=K_piEad81Iz-nkYVLuhyVItHUXLjvzh6EX8yE6sxgQk=',
        },
        {
          name: 'Western',
          imageUrl:
            'https://www.albertopoiatti.it/wp-content/uploads/2018/08/western.jpg',
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
      .bulkDelete('genres', {}, { transaction });
  });
};
