import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Opening, PositionType, StatusType } from './position.schema';

export type PortfolioDocument = HydratedDocument<Portfolio>;

export type Position = {
  portfolioId: string;
  price: number;
  quantity: number;
  status: StatusType;
  symbol: string;
  type: PositionType;
  date: string;
  ownerId: string;
  opening?: Opening;
};
@Schema({ toJSON: { virtuals: true } })
export class Portfolio {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  ownerId: string;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);

PortfolioSchema.virtual('positions', {
  ref: 'Position',
  localField: '_id',
  foreignField: 'portfolioId',
});
