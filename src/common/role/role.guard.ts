import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { USER_ROLE_TYPE } from '../constants/enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 데코레이터로 설정된 롤 수준을 가지고 (setMeatadata).
    const requiredRoles = this.reflector.getAllAndOverride<USER_ROLE_TYPE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 적용된 수준이 없다면 true를 반환.
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const role = request.user?.role ? request.user.role : undefined;

    // 토큰을 해제 했지만 롤이 없을 때
    if (!role) {
      return false;
    }

    return requiredRoles.includes(role);
  }
}
