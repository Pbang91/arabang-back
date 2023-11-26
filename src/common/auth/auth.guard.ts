import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    await this.validationRequest(request);
    return true;
  }

  private async validationRequest(request: Request): Promise<boolean> {
    const accessToken = request.headers.authorization?.split('Bearer ')[1] ?? '';

    if (accessToken === '') throw new UnauthorizedException('인가토큰이 없습니다');

    const payload = await this.authService.validationToken(accessToken);

    if (!payload) throw new UnauthorizedException('인증되지 않은 사용자 입니다.');

    request['user'] = payload;

    return true;
  }
}
