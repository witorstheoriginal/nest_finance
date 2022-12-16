import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
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

export const UserSchema = SchemaFactory.createForClass(User);
