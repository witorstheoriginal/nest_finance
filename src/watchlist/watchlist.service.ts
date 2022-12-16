import { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Watchlist,
  WatchlistDocument,
} from 'src/watchlist/schemas/watchlist.schema';
import {
  CreateWatchlistDto,
  FindOneParams,
} from 'src/watchlist/dto/create-watchlist.dto';
import { UpdateSymbolsDto } from './dto/update-symbols.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(Watchlist.name)
    private watchlistModel: Model<WatchlistDocument>,
  ) {}

  async create(createWatchlistDto: CreateWatchlistDto): Promise<Watchlist> {
    const createdWatchlist = new this.watchlistModel(createWatchlistDto);
    createWatchlistDto.symbols = Array.from(
      new Set(createWatchlistDto.symbols),
    );

    return createdWatchlist.save();
  }

  async findOne(id: FindOneParams): Promise<Watchlist> {
    return this.watchlistModel.findOne(id).exec();
  }

  async updateSymbols(id: FindOneParams, updateSymbolsDto: UpdateSymbolsDto) {
    const watchlist = this.findOne(id);

    (await watchlist).symbols = (await watchlist).symbols.concat(
      Array.from(new Set(updateSymbolsDto.add)),
    );

    const elementsToDeleteSe = new Set(updateSymbolsDto.add);
    (await watchlist).symbols = (await watchlist).symbols.filter((element) => {
      return !elementsToDeleteSe.has(element);
    });

    return this.watchlistModel.updateOne(id, watchlist).exec;
  }

  async updateOne(id: FindOneParams, updateWatchlistDto: UpdateWatchlistDto) {
    return this.watchlistModel.updateOne(id, updateWatchlistDto).exec;
  }

  async deleteOne(id: FindOneParams) {
    return this.watchlistModel.deleteOne(id).exec;
  }
}

Connection;
