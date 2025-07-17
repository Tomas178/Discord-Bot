import type { Response, Request, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { resolve } from 'path';

type JsonHandler<T> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;

export function jsonRoute<T>(
  handler: JsonHandler<T>,
  statusCode: StatusCodes.OK
): RequestHandler {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res, next);
      res.status(statusCode);
      res.json(result as T);
    } catch (error) {
      next(error);
    }
  };
}
