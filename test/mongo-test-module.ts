import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export const createMongoTestModule = (options: MongooseModuleOptions = {}) => {
  let mongod: MongoMemoryServer;

  const module = MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      return {
        uri: mongod.getUri(),
        ...options,
      };
    },
  });

  const closeConnection = async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  };

  return { module, closeConnection };
};
