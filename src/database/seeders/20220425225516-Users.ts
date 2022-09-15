import { hash } from 'bcrypt';
import Migration from '../../models/types/migration.type';

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.transaction(async (transaction) => {
    await sequelize.getQueryInterface().insert(
      null,
      'users',
      {
        email: 'john.doe@domain.com',
        password: await hash('1234567890', 10),
      },
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
      .delete(null, 'users', { email: 'john.doe@domain.com' }, { transaction });
  });
};
