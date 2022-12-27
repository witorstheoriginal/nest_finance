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
import { CurrentUser } from 'src/user/decorators';
import { CurrentUserEntity } from 'src/user/types';
import { AuthGuard } from '@nestjs/passport';
import { PortfolioService } from './services/portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { ClosePositionDto } from './dto/close-position.dto';
import { OpenPositionDto } from './dto/open-position.dto';

export class FindOneParams {
  @IsString()
  id: string;
}

@Controller('portfolio')
@UseGuards(AuthGuard())
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  create(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    return this.portfolioService.create(createPortfolioDto, user.sub);
  }

  @Get(':id')
  findById(
    @Param() { id }: FindOneParams,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    return this.portfolioService.find(id, user.sub);
  }

  @Post(':id/positions/open')
  openPosition(
    @Param() { id }: FindOneParams,
    @Body() openPositionDto: OpenPositionDto,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    return this.portfolioService.openPosition({
      id,
      openPositionDto,
      ownerId: user.sub,
    });
  }

  @Post(':id/positions/close')
  closePosition(
    @Param() { id }: FindOneParams,
    @Body() closePositionDto: ClosePositionDto,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    return this.portfolioService.closePosition({
      id,
      closePositionDto,
      ownerId: user.sub,
    });
  }

  @Put(':id')
  updateById(
    @Param() { id }: FindOneParams,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    return this.portfolioService.update({
      id,
      updatePortfolioDto,
      ownerId: user.sub,
    });
  }

  @Delete(':id')
  deleteById(
    @Param() { id }: FindOneParams,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    return this.portfolioService.delete(id, user.sub);
  }
}
