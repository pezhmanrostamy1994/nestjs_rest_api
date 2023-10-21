import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document as Doc } from 'mongoose';
import { User } from 'src/users/user.model';
import { converToShamsi } from '../commen/utils/date';

export type BranchDocument = Branch & Doc;

@Schema({ toJSON: { virtuals: true }, timestamps: true })
export class Branch extends Doc {
  @Prop({ required: true })
  showName: string;
  @Prop({ required: true, unique: true })
  branchCode: string;

  @Prop({ required: true, unique: true })
  branchName: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({})
  address: string;

  @Prop()
  mobile: string;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  user: User;

  @Prop({})
  ip: string;
  @Prop({ required: true, default: converToShamsi().numberShamsiDate })
  shamsiCreatedAt: number;
}
const branchModel = SchemaFactory.createForClass(Branch);

export const BranchSchema = branchModel;
