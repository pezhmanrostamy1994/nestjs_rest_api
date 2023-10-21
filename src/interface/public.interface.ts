import { Request } from 'express';

export interface Response extends PaginateDb {
  message?: string;
  success: boolean;
  data?: object | [];
}

export interface PaginateDb {
  docs: object;
  totalDocs: number | string;
  totalPages: number | string;
  page: number | string;
  limit: number | string;
  hasNextPage: Boolean;
  hasPrevPage: Boolean;
  prevPage: number | string;
  nextPage: number | string;
}

export interface SetPaginate {
  page?: number | string;
  limit?: number | string;
  model: any;
  data: Array<{ data: [] }>;
  searchQuery?: object;
}

export interface HttpRequest extends Request {
  user: {
    _id: string;
    mobile: string;
  };
  branch: {
    showName :string,
    branchName :string,
    user :string,
    ip :string,
  };
}
export interface HttpError extends Error {
  statusCode?: string | number;
}
