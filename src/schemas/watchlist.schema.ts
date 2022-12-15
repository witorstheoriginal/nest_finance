import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WatchlistDocument = HydratedDocument<Watchlist>;

export type Symbol = Array<string>;

@Schema()
export class Watchlist {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  // eslint-disable-next-line @typescript-eslint/ban-types
  symbols: Symbol[];
}

export const WatchlistSchema = SchemaFactory.createForClass(Watchlist);
