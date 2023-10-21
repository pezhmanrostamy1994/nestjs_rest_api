import { Controller, Get, Query, Req, Post, Body } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { RegisterCustomerFromBranchDto } from './dto/custommers.dto';

@Controller('v1/customers')
export class CustomersController {
  constructor(private customerServices: CustomersService) {}

  @Get()
  async getAllCustomer(@Query() query, @Req() req) {
    const { branchName } = req.branch.branchName;
    const getAllCustomer = await this.customerServices.getAllCustomer(
      query,
      branchName,
    );

    return {
      data: getAllCustomer,
      success: true,
    };
  }
  @Post('/registerUserFromBranchApp')
  async registerUserFromBranchApp(
    @Body() body: RegisterCustomerFromBranchDto,
    @Req() req,
  ) {
    const { branchName } = req.branch;
    const registerUserFromBranchApp =
      await this.customerServices.registerUserFromBranchApp(body, branchName);

    return {
      data: registerUserFromBranchApp,
      success: true,
    };
  }
}
