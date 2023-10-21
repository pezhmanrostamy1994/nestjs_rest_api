import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document as Doc } from 'mongoose';
import { converToShamsi } from 'src/commen/utils/date';
// import mongoosPaginateV2 from 'mongoose-paginate-v2';
export type EmployeeDocument = Employee & Doc;

@Schema({ toJSON: { virtuals: true }, timestamps: true })
export class Employee extends Doc {
  @Prop({ required: true, ref: 'User' })
  user: mongoose.Types.ObjectId;
  @Prop({ required: true, ref: 'Branch' })
  branch: mongoose.Types.ObjectId;
  @Prop({ required: true, default: converToShamsi().numberShamsiDate })
  shamsiCreatedAt: Number;
}
const employeeModel = SchemaFactory.createForClass(Employee);

export const EmployeeSchema = employeeModel;
