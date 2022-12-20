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

import { IsString } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';

const userId = '639c2eaad5318fb8cd1d1f4c';

export class FindOneParams {
  @IsString()
  id: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.validateUser(loginUserDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  /*@ Get(':id')
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
