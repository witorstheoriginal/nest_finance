import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Portfolio } from './portfolio.schema';

export type PositionDocument = HydratedDocument<Position>;

@Schema()
export class Position {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' })
  portfolioId: Portfolio;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  status: 'opened' | 'closed';

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  type: 'buy' | 'sell';

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  ownerId: string;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
