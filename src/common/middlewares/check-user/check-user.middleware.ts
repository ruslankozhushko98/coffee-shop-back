import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CheckUserMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers?.authorization?.split(' ')[1];

    if (accessToken) {
      const userData = this.jwt.decode(accessToken);

      req.user = {
        id: userData.userId,
        email: userData.email,
      };
    }

    next();
  }
}
