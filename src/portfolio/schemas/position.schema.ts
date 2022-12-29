import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Portfolio } from './portfolio.schema';

export type PositionDocument = HydratedDocument<Position>;

enum PositionType {
  Buy = 'buy',
  Sell = 'sell',
}

enum StatusType {
  Open = 'open',
  Close = 'close',
}

@Schema()
export class Position {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' })
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

  @Prop()
  opening: {
    price: number;
    quantity: number;
    date: string;
  };
}

export const PositionSchema = SchemaFactory.createForClass(Position);
