import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseFilters,
} from '@nestjs/common';
import { PaginateDb, Response } from '../interface/public.interface';
import { RegisterDto } from './dto/public.dto';
import { UserRo } from './user.interface';
import { UsersService } from './users.service';
// import { RegisterDto } from './validations.pipe';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller('v1/users')
export class UsersController {
  constructor(private userServices: UsersService) {}

  @Get()
  test(@Query() query): Promise<PaginateDb> {
    return this.userServices.getAllUser(query);
  }

  @Post('/register')
  // @UseFilters(new I18nValidationExceptionFilter())
  async register(@Body() body: RegisterDto, @I18n() i18n: I18nContext) {
    const data: UserRo = await this.userServices.register(body);

    return {
      data,
      success: true,
    };
  }
}
