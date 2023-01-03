import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Watchlist, WatchlistSchema } from './schemas/watchlist.schema';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Watchlist.name, schema: WatchlistSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
