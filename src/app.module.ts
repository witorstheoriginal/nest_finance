import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './configuration';
import { UserModule } from './user/user.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('database.connectionString'),
      }),
    }),
    WatchlistModule,
    UserModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
