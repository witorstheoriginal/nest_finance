import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { PortfolioDocument } from 'src/portfolio/schemas/portfolio.schema';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private portfolioModel: Model<PortfolioDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument | null> {
    const user = await this.findByEmail(createUserDto.email);

    if (!user) {
      throw new Error('User already registered.');
    }

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, saltRounds),
    });
    const portfolio = this.portfolioModel.create(
      { name: 'First Portfolio' },
      { _id: newUser._id.toString() },
    );

    console.log(newUser._id.toString());
    return newUser;
  }

  find(email: string, password: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, password }).exec();
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.findByEmail(loginUserDto.email);

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(loginUserDto.password, user.password);

    return isValid ? user : null;
  }

  /*async updateSymbols(params: {
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
  } */
}
