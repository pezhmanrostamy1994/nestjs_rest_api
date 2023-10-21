import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as Doc } from 'mongoose';
import { converToShamsi } from 'src/commen/utils/date';
// import mongoosPaginateV2 from 'mongoose-paginate-v2';
export type CustomerDocument = Customer & Doc;

@Schema({ toJSON: { virtuals: true }, timestamps: true })
export class Customer extends Doc {
  @Prop({ required: true, ref: 'Branch' })
  branch: string;
  @Prop({ required: true, ref: 'User' })
  user: string;
  @Prop({ required: true, default: converToShamsi().numberShamsiDate })
  shamsiCreatedAt: Number;
}
const customerModel = SchemaFactory.createForClass(Customer);

export const CustomerSchema = customerModel;
