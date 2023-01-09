import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { IsString } from 'class-validator';
import { CurrentUserEntity } from '../user/types';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateSymbolsDto } from './dto/update-symbols.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { WatchlistService } from './watchlist.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../user/decorators';

export class FindOneParams {
  @IsString()
  id: string;
}

@Controller('watchlist')
@UseGuards(AuthGuard())
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  create(
    @Body() createWatchlistDto: CreateWatchlistDto,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    return this.watchlistService.create(createWatchlistDto, user.sub);
  }

  @Get(':id')
  findById(
    @Param() { id }: FindOneParams,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    return this.watchlistService.find(id, user.sub);
  }

  @Post(':id/symbols')
  updateSymbols(
    @Param() { id }: FindOneParams,
    @Body() updateSymbolsDto: UpdateSymbolsDto,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    return this.watchlistService.updateSymbols({
      id,
      updateSymbolsDto,
      ownerId: user.sub,
    });
  }

  @Put(':id')
  updateById(
    @Param() { id }: FindOneParams,
    @Body() updateWatchlistDto: UpdateWatchlistDto,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    return this.watchlistService.update({
      id,
      updateWatchlistDto,
      ownerId: user.sub,
    });
  }

  @Delete(':id')
  deleteById(
    @Param() { id }: FindOneParams,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    return this.watchlistService.delete(id, user.sub);
  }
}
