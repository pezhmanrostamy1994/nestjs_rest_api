import { Body, Controller, Get, Post } from '@nestjs/common';
import { BranchsService } from './branchs.service';
import { BranchDto, BranchLoginDTo } from './dto/public';
@Controller('/v1/branchs')
export class BranchsController {
  constructor(private branchServices: BranchsService) {}

  @Get()
  async getAll() {
    const data = await this.branchServices.getAllBranchWithoutPaginate();

    return {
      data,
      success: true,
    };
  }
  @Post('/verifyBranch')
  async verifyBranch(@Body() body: BranchLoginDTo) {
    const data = await this.branchServices.verifyBranch(body);
    return {
      data,
      success: true,
    };
  }

  @Post()
  async create(@Body() body: BranchDto) {
    const createBranch = await this.branchServices.createBranch(body);

    return {
      data: createBranch,
      success: true,
    };
  }
}
