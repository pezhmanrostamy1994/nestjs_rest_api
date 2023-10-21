import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Branch, BranchDocument } from './branch.model';
import { BranchDto, BranchLoginDTo } from './dto/public';
import { I18nRequestScopeService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { constantsUtils, functions } from 'src/commen/utils';

@Injectable()
export class BranchsService {
  constructor(
    @InjectModel(Branch.name) private BranchModel: Model<BranchDocument>,
    private readonly i18n: I18nRequestScopeService,
    private readonly jwtService: JwtService,
  ) {}

  async findOneBranchWithBranchName(branchName: string) {
    const findBranch = await this.BranchModel.findOne({ branchName });
    return findBranch;
  }
  async getAllBranchWithoutPaginate() {
    try {
      const findBranch = await this.BranchModel.find({})
        .populate('user')
        .select('+password');

      return {
        data: findBranch,
      };
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.statusCode);
    }
  }
  async verifyBranch(body: BranchLoginDTo) {
    try {
      const { branchName, password } = body;
      const findBranch = await this.BranchModel.findOne({
        branchName,
      })
        .populate('user')
        .select('+password');
      console.log(findBranch);
      if (!findBranch) {
        throw {
          message: this.i18n.translate('validation.INFORMATION_WRONG'),
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        };
      }

      const checkPassword = bcrypt.compare(password, findBranch.password);

      if (!checkPassword) {
        throw {
          message: this.i18n.translate('validation.INFORMATION_WRONG'),
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        };
      }
      const { showName, address, mobile, user, ip, shamsiCreatedAt } =
        findBranch;
      const payload = {
        branchName,
        branchCode: findBranch.branchCode,
        showName,
        address,
        mobile,
        ip,
        shamsiCreatedAt,
        role: constantsUtils.rols.branch,
        userId: findBranch.user._id,
        userMobile: findBranch.user.mobile,
      };

      const token = this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      return {
        showName: findBranch.showName,
        branchDetails: {
          branchCode: findBranch.branchCode,
          mobile: findBranch.mobile,
          address: findBranch.address,
        },
        shamsiCreatedAt: findBranch.shamsiCreatedAt,
        token,
      };
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.statusCode);
    }
  }
  async createBranch(body: BranchDto) {
    try {
      const { branchName, password } = body;
      const findBranchByBranchName = await this.BranchModel.findOne({
        branchName,
      });
      if (findBranchByBranchName) {
        throw {
          message: this.i18n.translate('validation.BRANCHNAE_REGISTERED'),
          statusCode: HttpStatus.CONFLICT,
        };
      }
      let branchCode;
      let runLoop = true;
      while (runLoop) {
        const randomCode = 10000 + Math.floor(Math.random() * (99999 - 10000));
        const findBranch = await this.BranchModel.findOne({
          branchCode: randomCode,
        });
        if (!findBranch) {
          branchCode = randomCode;
          runLoop = false;
        }
      }

      const newSchema = new this.BranchModel({
        ...body,
        user:body.user,
        branchCode,
        password: await bcrypt.hash(password, 12),
      });

      const newBranch = await newSchema.save();

      return newBranch;
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.statusCode);
    }
  }
}
