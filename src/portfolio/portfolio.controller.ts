import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { IsString } from 'class-validator';
import { CurrentUser } from '../user/decorators';
import { CurrentUserEntity } from 'src/user/types';
import { AuthGuard } from '@nestjs/passport';
import { PortfolioService } from './services/portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { ClosePositionDto } from './dto/close-position.dto';
import { OpenPositionDto } from './dto/open-position.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UserService } from '../user/user.service';
import { FinnhubService } from '../core/services/finnhub.service';
import { ForbiddenException } from '@nestjs/common';

export class FindOneParams {
  @IsString()
  id: string;
}

@Controller('portfolio')
@UseGuards(AuthGuard())
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly userService: UserService,
    private readonly finnhubService: FinnhubService,
  ) {}

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
    //populate per unire portfolio alle sue posizioni
    return this.portfolioService.findPortfolio(id, user.sub);
  }

  @Post('positions/open')
  async openPosition(
    @Body() openPositionDto: OpenPositionDto,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    const price = await this.finnhubService.getStockPrice(
      openPositionDto.symbol,
    );
    const isBalanceSufficient = await this.userService.checkBalance(
      user.sub,
      -price * openPositionDto.quantity,
    );

    if (!isBalanceSufficient) {
      throw new ForbiddenException('Balance too low to open new position!');
    }

    //mandare in parallelo queste due
    await this.userService.updateBalance(
      user.sub,
      price * openPositionDto.quantity,
    );

    return this.portfolioService.openPosition({
      openPositionDto,
      ownerId: user.sub,
      price,
    });
  }

  @Post('positions/close')
  async closePosition(
    @Body() closePositionDto: ClosePositionDto,
    @CurrentUser() user: CurrentUserEntity,
  ) {
    const position = await this.portfolioService.findPosition(
      closePositionDto.id,
      user.sub,
    );

    if (!position) {
      throw new NotFoundException(
        "Position with given id doesn't belong to current user.",
      );
    }

    const price = await this.finnhubService.getStockPrice(position.symbol);

    await this.userService.updateBalance(user.sub, price * position.quantity);

    return this.portfolioService.closePosition({
      closePositionDto,
      ownerId: user.sub,
      price,
      position,
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
