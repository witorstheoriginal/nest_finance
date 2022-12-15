import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WatchlistDocument = HydratedDocument<Watchlist>;

type Symbol = Array<string>;

@Schema()
export class Watchlist {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  ownerId: string;

  @Prop()
  // eslint-disable-next-line @typescript-eslint/ban-types
  symbols: Symbol[];
}

export const CatSchema = SchemaFactory.createForClass(Watchlist);
