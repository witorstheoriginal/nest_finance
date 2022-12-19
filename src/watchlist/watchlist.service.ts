import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Watchlist, WatchlistDocument } from './schemas/watchlist.schema';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
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
      symbols: Array.from(new Set(createWatchlistDto.symbols)),
    });

    return createdWatchlist.save();
  }

  find(id: string, ownerId: string): Promise<WatchlistDocument | null> {
    return this.watchlistModel.findOne({ _id: id, ownerId }).exec();
  }

  async updateSymbols(params: {
    id: string;
    updateSymbolsDto: UpdateSymbolsDto;
    ownerId: string;
  }): Promise<WatchlistDocument | null> {
    let result: WatchlistDocument | null = await this.find(
      params.id,
      params.ownerId,
    );

    if (params.updateSymbolsDto.add.length > 0) {
      result = await this.watchlistModel.findOneAndUpdate(
        { _id: params.id, ownerId: params.ownerId },
        {
          $addToSet: { symbols: { $each: params.updateSymbolsDto.add } },
        },
        { new: true },
      );
    }
    if (params.updateSymbolsDto.remove.length > 0) {
      result = await this.watchlistModel.findOneAndUpdate(
        { _id: params.id, ownerId: params.ownerId },
        {
          $pull: { symbols: { $in: params.updateSymbolsDto.remove } },
        },
        { new: true },
      );
    }

    return result;
  }

  update(params: {
    id: string;
    updateWatchlistDto: UpdateWatchlistDto;
    ownerId: string;
  }): Promise<WatchlistDocument | null> {
    return this.watchlistModel
      .findOneAndUpdate(
        { _id: params.id, ownerId: params.ownerId },
        {
          name: params.updateWatchlistDto.name,
          description: params.updateWatchlistDto.description,
        },
        { new: true },
      )
      .exec();
  }

  delete(id: string, ownerId: string) {
    return this.watchlistModel.deleteOne({ _id: id, ownerId }).exec();
  }
}
