import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExpressRequest } from '@app/user/types/exprress-request';
import { UnifiedError } from '@app/shared/lib/unified-error';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    if (request.user) return true;

    throw UnifiedError({
      title: 'Unauthorized',
      message: '',
      httpStatus: HttpStatus.UNAUTHORIZED,
    });
  }
}
