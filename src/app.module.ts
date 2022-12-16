import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:EYW7T123i959VgVd@maincluster.ufwqaei.mongodb.net/?retryWrites=true&w=majority',
    ),
    WatchlistModule,
  ],
})
export class AppModule {}
