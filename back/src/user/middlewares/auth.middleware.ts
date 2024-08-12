import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/configs/jwt.config';
import { UserService } from '@app/user/user.service';
import { ExpressRequest } from '@app/user/types/exprress-request';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, JWT_SECRET);

      req.user = await this.userService.findById((decode as JwtPayload).id);
    } catch (err) {
      req.user = null;
    }

    next();
  }
}
