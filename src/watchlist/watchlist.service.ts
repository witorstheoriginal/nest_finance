import { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Watchlist,
  WatchlistDocument,
} from 'src/watchlist/schemas/watchlist.schema';
import { CreateWatchlistDto } from 'src/watchlist/dto/watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(Watchlist.name)
    private watchlistModel: Model<WatchlistDocument>,
  ) {}

  async create(createWatchlistDto: CreateWatchlistDto): Promise<Watchlist> {
    const createdWatchlist = new this.watchlistModel(createWatchlistDto);
    return createdWatchlist.save();
  }

  async findAll(): Promise<Watchlist[]> {
    return this.watchlistModel.find().exec();
  }
}

Connection;
