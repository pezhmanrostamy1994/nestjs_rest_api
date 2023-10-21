import { Module } from '@nestjs/common';
import { BranchsService } from './branchs.service';
import { BranchsController } from './branchs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchSchema, Branch } from './branch.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule ,
    MongooseModule.forFeatureAsync([
      {
        name: Branch.name,
        useFactory: () => {
          const schema = BranchSchema;
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),


  ],
  providers: [BranchsService],
  controllers: [BranchsController],
})
export class BranchsModule {}
