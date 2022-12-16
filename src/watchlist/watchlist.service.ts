import { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Watchlist,
  WatchlistDocument,
} from 'src/watchlist/schemas/watchlist.schema';
import { CreateWatchlistDto } from 'src/watchlist/dto/create-watchlist.dto';
import { UpdateSymbolsDto } from './dto/update-symbols.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(Watchlist.name)
    private watchlistModel: Model<WatchlistDocument>,
  ) {}

  create(
    createWatchlistDto: CreateWatchlistDto,
    ownerId: string,
  ): Promise<WatchlistDocument | null> {
    const createdWatchlist = new this.watchlistModel({
      ...createWatchlistDto,
      ownerId,
    });
    createWatchlistDto.symbols = Array.from(
      new Set(createWatchlistDto.symbols),
    );

    return createdWatchlist.save();
  }

  findById(id: string, ownerId: string): Promise<WatchlistDocument | null> {
    return this.watchlistModel.findOne({ _id: id, ownerId }).exec();
  }

  updateSymbols(params: {
    id: string;
    updateSymbolsDto: UpdateSymbolsDto;
    ownerId: string;
  }) {
    return this.watchlistModel
      .updateOne(
        { _id: params.id, ownerId: params.ownerId },
        { $addToSet: { symbols: { $each: params.updateSymbolsDto } } },
      )
      .exec();
  }

  updateById(params: {
    id: string;
    updateWatchlistDto: UpdateWatchlistDto;
    ownerId: string;
  }) {
    return this.watchlistModel
      .updateOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  delete(id: string, ownerId: string) {
    return this.watchlistModel.deleteOne({ _id: id, ownerId }).exec();
  }
}

Connection;
