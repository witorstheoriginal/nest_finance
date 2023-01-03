import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { ForbiddenException } from '@nestjs/common';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument | null> {
    const user = await this.findByEmail(createUserDto.email);

    if (!user) {
      throw new ForbiddenException('User already registered.');
    }

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, saltRounds),
    });

    return newUser;
  }

  find(email: string, password: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, password }).exec();
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne(
        {
          email,
        },
        { password: true },
      )
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

  async checkBalance(userId: string, price: number): Promise<boolean> {
    const user = await this.userModel
      .findById(userId)
      .select({ balance: true });

    if (!user?.balance) {
      throw new Error('Failed to find id with given user');
    }

    return user.balance >= price;
  }

  async updateBalance(userId: string, value: number) {
    return this.userModel
      .findOneAndUpdate(
        { _id: userId },
        { $inc: { balance: value } },
        { new: true },
      )
      .select({ balance: true })
      .exec();
  }

  findMe(userId: string) {
    return this.userModel.findById({ _id: userId }).exec();
  }

  initUser(id: string, email: string, balance: number) {
    return this.userModel.create({
      _id: id,
      email,
      balance,
      password: 'password',
    });
  }
  /*

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
