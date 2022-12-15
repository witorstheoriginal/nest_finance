import { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateActionDto } from './dto/create-action.dto';
import { Action, ActionDocument } from 'src/schemas/action.schema';

@Injectable()
export class ActionService {
  constructor(
    @InjectModel(Action.name)
    private actionModel: Model<ActionDocument>,
  ) {}

  async create(createActionDto: CreateActionDto): Promise<Action> {
    const createdAction = new this.actionModel(createActionDto);
    return createdAction.save();
  }

  async findAll(): Promise<Action[]> {
    return this.actionModel.find().exec();
  }
}
Connection;
