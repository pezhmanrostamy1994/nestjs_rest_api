import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginate } from 'src/commen/utils/paginate';
import { PaginateDb } from '../interface/public.interface';
import { RegisterEmployeeDto, SearchAllEmployees } from './dto/public.dto';
import { Employee, EmployeeDocument } from './employees.model';
import * as bcrypt from 'bcrypt';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { User, UserDocument } from 'src/users/user.model';
import { Branch, BranchDocument } from 'src/branchs/branch.model';
import { BranchsService } from 'src/branchs/branchs.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private EmployeeModel: Model<EmployeeDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Branch.name) private BranchModel: Model<BranchDocument>,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  public async getAllEmployee(query: SearchAllEmployees): Promise<PaginateDb> {
    let { limit, page, skip } = query;

    const searchQuery = {};
    const data = await this.EmployeeModel.aggregate([
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
      model: this.EmployeeModel,
      searchQuery,
      data: data,
    });

    return parsData;
  }

  async registerEmployee(body: RegisterEmployeeDto, branchName: string) {
    try {
      const { mobile, name, password } = body;

      //find Branch
      const findBranch = await this.BranchModel.findOne({ branchName });
      //find user with this mobile
      let user = await this.UserModel.findOne({ mobile });
      //findEmployee
      const findEmployeeByThisMobile = await this.EmployeeModel.findOne({
        user,
        branch: findBranch,
      });
      if (findEmployeeByThisMobile) {
        throw {
          message: this.i18n.translate('validation.thisMobileExist'),
          statusCode: HttpStatus.CONFLICT,
        };
      }

      if (!user) {
        //Regiseter new user
        const newUerSchema = new this.UserModel({
          mobile,
          name,
          password: await bcrypt.hash(password, 12),
        });

        user = await newUerSchema.save();
      }

      //Register new Employee
      const newEmployeeSchema = new this.EmployeeModel({
        user: user._id,
        branch: findBranch._id,
      });

      const newEmployee = await newEmployeeSchema.save();

      return {
        data: newEmployee,
      };
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.statusCode);
    }
  }
}
