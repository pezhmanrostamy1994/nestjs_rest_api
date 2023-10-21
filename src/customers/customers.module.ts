import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema, Customer } from './customers.model';
import { HttpRequest } from 'src/interface/public.interface';
import { NextFunction, Response } from 'express';
import { branchAuth } from 'src/commen/middleware/auth.middleware';
import { User, UserSchema } from 'src/users/user.model';
import { Branch, BranchSchema } from 'src/branchs/branch.model';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Customer.name,
        useFactory: () => {
          const schema = CustomerSchema;
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),
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
        name: Branch.name,
        useFactory: () => {
          const schema = BranchSchema;
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: HttpRequest, res: Response, next: NextFunction) =>
        branchAuth(req, res, next),
      )
      .forRoutes(
        { path: '/v1/customers', method: RequestMethod.GET },
        {
          path: '/v1/customers/registerUserFromBranchApp',
          method: RequestMethod.POST,
        },
      );
  }
}
