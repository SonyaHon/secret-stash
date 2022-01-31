import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session as Record<string, any>;

    if (!session || !session.data || !session.data.loggedIn) {
      throw new HttpException('Unauthorized request', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
