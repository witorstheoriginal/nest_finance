import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PortfolioDocument = HydratedDocument<Portfolio>;

@Schema()
export class Portfolio {
  @Prop({ required: true })
  name: string;

  /*   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Position' })
  positions: Position[]; */

  @Prop({ required: true })
  ownerId: string;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
