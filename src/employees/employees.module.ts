import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { EmployeeController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeSchema, Employee } from './employees.model';
import { User, UserSchema } from '../users/user.model';
import { Branch, BranchSchema } from '../branchs/branch.model';
import { branchAuth } from 'src/commen/middleware/auth.middleware';
import { Response, NextFunction } from 'express';
import { HttpRequest } from 'src/interface/public.interface';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Employee.name,
        useFactory: () => {
          const schema = EmployeeSchema;
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),
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
  controllers: [EmployeeController],
  providers: [EmployeesService],
})
export class EmployeeeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: HttpRequest, res: Response, next: NextFunction) =>
        branchAuth(req, res, next),
      )
      .forRoutes(
        { path: '/v1/employees', method: RequestMethod.GET },
        { path: '/v1/employees', method: RequestMethod.POST },
      );
    // consumer
    //   .apply(auth)
    //   .forRoutes(
    //     { path: '/v1/employees', method: RequestMethod.GET },
    //     { path: '/v1/employees', method: RequestMethod.GET },
    //   );
  }
}
