import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Portfolio } from './portfolio.schema';

export type PositionDocument = HydratedDocument<Position>;

export enum PositionType {
  Buy = 'buy',
  Sell = 'sell',
}

export enum StatusType {
  Open = 'open',
  Close = 'close',
}

export class Opening {
  price: number;
  quantity: number;
  date: string;
}

@Schema({ optimisticConcurrency: true })
export class Position {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true,
  })
  portfolioId: Portfolio;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  status: StatusType;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true, enum: PositionType })
  type: PositionType;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop(Opening)
  opening?: Opening;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
