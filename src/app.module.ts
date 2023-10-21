import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import {
  AcceptLanguageResolver, 
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { UsersModule } from './users/users.module';
import { EmployeeeModule } from './employees/employees.module';
import { BranchsModule } from './branchs/branchs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    CustomersModule,
    BranchsModule,
    EmployeeeModule,
    MongooseModule.forRoot('mongodb://localhost/webExchange'),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
