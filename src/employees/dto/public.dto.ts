export class Paginate {
  limit?: string | number;
  page?: string | number;
  skip?: string | number;
}

export class SearchAllEmployees extends Paginate {
  name?: string;
}

export class RegisterEmployeeDto {
  name: String;
  mobile: string;
  password: String;
}
