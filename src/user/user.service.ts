import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

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
      throw new Error('User already registered.');
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

  async checkBalance(userId: string, price: number): Promise<boolean> {
    const user = await this.userModel.findOne({ _id: userId });

    return user && user.balance >= price ? true : false;
  }

  async updateBalance(userId: string, price: number) {
    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      throw new Error('No user with that id.');
    }

    return this.userModel
      .findOneAndUpdate({ _id: userId }, { balance: user.balance - price })
      .exec();
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
