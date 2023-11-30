import { User } from './entity/User';
import logger from './logging/logger';
import { DatabaseService } from './services/typeorm.service';

DatabaseService.initialize()
  .then(async () => {
    logger.info('Inserting a new user into the database...');
    const user = new User();
    user.firstName = 'Timber';
    user.lastName = 'Saw';
    user.age = 25;
    await DatabaseService.manager.save(user);
    logger.info('Saved a new user with id: ' + user.id);

    logger.info('Loading users from the database...');
    const users = await DatabaseService.manager.find(User);
    logger.info('Loaded users: ', users);

    logger.info(
      'Here you can setup and run express / fastify / any other framework.',
    );
  })
  .catch((error) => logger.error(error));
