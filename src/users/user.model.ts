import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as Doc } from 'mongoose';
import { constantsUtils } from 'src/commen/utils';
import { converToShamsi } from 'src/commen/utils/date';
// import mongoosPaginateV2 from 'mongoose-paginate-v2';
export type UserDocument = User & Doc;

@Schema({ toJSON: { virtuals: true }, timestamps: true })
export class User extends Doc {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, enum: Object.values(constantsUtils.generateBy) ,default:constantsUtils.generateBy.user})
  generateBy: string;
  @Prop({})
  address: string;
  @Prop({ required: true, unique: true })
  mobile: string;
  @Prop({})
  email: string;
  @Prop({
    required: function () {
      return this.generateBy !== constantsUtils.generateBy.branch;
    },
    select: false,
  })
  password: string;
  @Prop({ required: true, default: converToShamsi().numberShamsiDate })
  shamsiCreatedAt: Number;
}
const userModel = SchemaFactory.createForClass(User);

export const UserSchema = userModel;
