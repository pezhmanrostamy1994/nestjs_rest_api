import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginate } from 'src/commen/utils/paginate';
import { PaginateDb } from '../interface/public.interface';
import { UserRo } from './user.interface';
import { SearchAllUsers } from './dto/public.dto';
import { User, UserDocument } from './user.model';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/public.dto';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  public async getAllUser(query: SearchAllUsers): Promise<PaginateDb> {
    let { limit, page, skip } = query;

    const searchQuery = {};
    const data = await this.UserModel.aggregate([
      {
        $match: searchQuery,
      },
      {
        $facet: {
          paginate: [
            { $count: 'totalDocs' },
            {
              $addFields: {
                page,
                limit: +limit,
              },
            },
          ],
          data: [{ $skip: +skip }, { $limit: +limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);

    const parsData: PaginateDb = await paginate({
      page,
      limit,
      model: this.UserModel,
      searchQuery,
      data: data,
    });

    return parsData;
  }

  public async register(body: RegisterDto): Promise<UserRo> {
    try {
      // //email must be unique
      // const findUserByEmail = await this.UserModel.findOne({
      //   email: body.email,
      // });
      // if (findUserByEmail) {
      //   throw {
      //     message: await this.i18n.translate('validation.EMAIL_REGISTERED'),
      //     statusCode: HttpStatus.CONFLICT,
      //   };
      // }
      //mobile must be unique
      const findUserByMobile = await this.UserModel.findOne({
        mobile: body.mobile,
      });
      if (findUserByMobile) {
        throw {
          message: await this.i18n.translate('validation.MOBILE_REGISTERED'),
          statusCode: HttpStatus.CONFLICT,
        };
      }

      const newBody = {
        ...body,
        password: await bcrypt.hash(body.password, 12),
      };
      const registerUser = await new this.UserModel(newBody).save();

      return registerUser;
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.statusCode);
    }
  }

  public async registerUserFromBranchApp(){

  }
}
