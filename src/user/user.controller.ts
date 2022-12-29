import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IsString } from 'class-validator';
import { CreatePortfolioDto } from 'src/portfolio/dto/create-portfolio.dto';
import { PortfolioService } from 'src/portfolio/services/portfolio.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CurrentUserEntity } from './types';
import { UserService } from './user.service';

const userId = '639c2eaad5318fb8cd1d1f4c';

export class FindOneParams {
  @IsString()
  id: string;
}

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly portfolioService: PortfolioService,
  ) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    if (user) {
      this.portfolioService.create({ name: 'Default' }, user._id.toString());
    }

    return user;
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.validateUser(loginUserDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: CurrentUserEntity = {
      email: user.email,
      sub: user._id.toString(),
    };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
    };
  }

  /*@ Get(':id') d
  findById(@Param() { id }: FindOneParams) {
    return this.userService.find(id, userId);
  }

  @Post(':id/symbols')
  updateSymbols(
    @Param() { id }: FindOneParams,
    @Body() updateSymbolsDto: UpdateSymbolsDto,
  ) {
    return this.watchlistService.updateSymbols({
      id,
      updateSymbolsDto,
      ownerId: userId,
    });
  }

  @Put(':id')
  updateById(
    @Param() { id }: FindOneParams,
    @Body() updateWatchlistDto: UpdateWatchlistDto,
  ) {
    return this.watchlistService.update({
      id,
      updateWatchlistDto,
      ownerId: userId,
    });
  }

  @Delete(':id')
  deleteById(@Param() { id }: FindOneParams) {
    return this.watchlistService.delete(id, userId);
  } */
}
