import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpError, HttpRequest } from 'src/interface/public.interface';
/**
 * this file must be refactor
 */
export function auth(
  req: HttpRequest,
  res: Response,
  next: NextFunction,
  roles: [string],
) {
  const authHeaderInAuthorization = req.header('Authorization');

  if (!authHeaderInAuthorization) {
    const error: HttpError = new Error('Not Authenticated.');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeaderInAuthorization.split(' ')[1];

  // 'Bearer token'
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      const error: HttpError = new Error('token expired');
      error.statusCode = 401;
      throw error;
    } else {
      const error: HttpError = new Error('Invalid token.');
      error.statusCode = 400;
      throw error;
    }
  }

  if (!decodedToken) {
    const error: HttpError = new Error('Not Authenticated.');
    error.statusCode = 401;
    throw error;
  }

  if (roles.length) {
    if (!roles.includes(decodedToken.role)) {
      const error: HttpError = new Error('Not Authorized.');
      error.statusCode = 403;
      throw error;
    }
  }

  req.user = { _id: decodedToken.userId, mobile: decodedToken.userMobile };
  req.branch = {
    branchName: decodedToken.branchName,
    showName: decodedToken.showName,
    user: decodedToken.userId,
    ip: decodedToken.ip,
  };
  return next();
}

export function branchAuth(
  req: HttpRequest,
  res: Response,
  next: NextFunction,
) { 
  const authHeaderInAuthorization = req.header('Authorization');

  if (!authHeaderInAuthorization) {
    const error: HttpError = new Error('Not Authenticated.');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeaderInAuthorization.split(' ')[1];

  // 'Bearer token'
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      const error: HttpError = new Error('token expired');
      error.statusCode = 401;
      throw error;
    } else {
      const error: HttpError = new Error('Invalid token.');
      error.statusCode = 400;
      throw error;
    }
  }

  if (!decodedToken) {
    const error: HttpError = new Error('Not Authenticated.');
    error.statusCode = 401;
    throw error;
  }

  req.branch = decodedToken;
  return next();
}
