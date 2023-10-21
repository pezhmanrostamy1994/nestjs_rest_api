import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginate } from 'src/commen/utils/paginate';
import { PaginateDb } from '../interface/public.interface';
import { SearchAllData } from '../commen/dto/public.dto';
import { Customer, CustomerDocument } from './customers.model';
import { Branch, BranchDocument } from '../branchs/branch.model';
import { User, UserDocument } from '../users/user.model';
import { I18n, I18nRequestScopeService } from 'nestjs-i18n';
import { RegisterCustomerFromBranchDto } from './dto/custommers.dto';
import { constantsUtils } from 'src/commen/utils';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private CustomerModel: Model<CustomerDocument>,
    @InjectModel(Branch.name) private BranchModel: Model<BranchDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  public async getAllCustomer(
    query: SearchAllData,
    branchName: string,
  ): Promise<PaginateDb> {
    let { limit, page, skip } = query;

    const searchQuery = { branchName };
    const data = await this.CustomerModel.aggregate([
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
      model: this.CustomerModel,
      searchQuery,
      data: data,
    });

    return parsData;
  }

  public async registerUserFromBranchApp(
    body: RegisterCustomerFromBranchDto,
    branchName: String,
  ) {
    try {
      const { mobile } = body;
      
      const findBranch = await this.BranchModel.findOne({ branchName });
      let findUserByMobile = await this.UserModel.findOne({ mobile });

      if (findUserByMobile) { 
        const findCustomer = await this.CustomerModel.findOne({
          branch: findBranch._id,
          user: findUserByMobile._id,
        });
        if (findCustomer) {
          return {
            data: findUserByMobile,
          };
        }
      }

      if (!findUserByMobile) {
        //Regiseter new user
        const newUerSchema = new this.UserModel({
          ...body,
          generateBy: constantsUtils.generateBy.branch,
        });

        findUserByMobile = await newUerSchema.save();
      }

      //Regiseter new user
      const newUerSchema = new this.CustomerModel({
        user: findUserByMobile._id,
        branch: findBranch._id,
      });

      const newCustomer = await newUerSchema.save();

      return {
        data: newCustomer,
      };
    } catch (err) {
      console.log(err)
      throw new HttpException(err.message || 'server error', err.statusCode);
    }
  }
}
