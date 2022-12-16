import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchlistController } from './watchlist/watchlist.controller';
import { WatchlistService } from './watchlist/watchlist.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:<password>@maincluster.ufwqaei.mongodb.net/?retryWrites=true&w=majority',
    ),
  ],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class AppModule {}
