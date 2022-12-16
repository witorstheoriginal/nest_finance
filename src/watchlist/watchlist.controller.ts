import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common/decorators';
import { CreateWatchlistDto, FindOneParams } from './dto/create-watchlist.dto';
import { UpdateSymbolsDto } from './dto/update-symbols.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { WatchlistService } from './watchlist.service';

@Controller()
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  create(@Body() createWatchlistDto: CreateWatchlistDto) {
    return this.watchlistService.create(createWatchlistDto);
  }

  @Get(':id')
  findOne(@Param() params: FindOneParams) {
    return this.watchlistService.findOne(params);
  }

  @Post(':id/symbols')
  updateSymbols(
    @Param() params: FindOneParams,
    @Body() updateSymbolsDto: UpdateSymbolsDto,
  ) {
    return this.watchlistService.updateSymbols(params, updateSymbolsDto);
  }

  @Put(':id')
  updateOne(
    @Param() params: FindOneParams,
    @Body() updateWatchlistDto: UpdateWatchlistDto,
  ) {
    return this.watchlistService.updateOne(params, updateWatchlistDto);
  }

  @Delete(':id')
  deleteOne(@Param() params: FindOneParams) {
    return this.watchlistService.deleteOne(params);
  }
}
