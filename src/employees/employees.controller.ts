import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { PaginateDb, Response } from '../interface/public.interface';
import { RegisterEmployeeDto } from './dto/public.dto';
import { EmployeesService } from './employees.service';

@Controller('v1/employees')
export class EmployeeController {
  constructor(private employeesServices: EmployeesService) {}

  @Get('/')
  test(@Query() query): Promise<PaginateDb> {
    return this.employeesServices.getAllEmployee(query);
  }
  @Post('/')
  async registerEmployee(@Body() body: RegisterEmployeeDto, @Req() req) {
    const branchName = req.branch.branchName;

    const createEmployee = await this.employeesServices.registerEmployee(
      body,
      branchName,
    );
    return {
      data: createEmployee,
      success: true,
    };
  }
}
