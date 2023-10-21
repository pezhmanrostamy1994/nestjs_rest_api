import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Paginate } from 'src/users/dto/public.dto';

@Injectable()
export class PaginateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let { page, limit }: Paginate = req.query;
    page = page || 1
    limit = limit || 10
    req.query.skip = String(+page > 1 ? +page : 0);
    req.query.page = String(page ? +page : 1);
    req.query.limit = String(limit ? +limit : 10);

    next();
  }
}

export const paginate = new PaginateMiddleware();
