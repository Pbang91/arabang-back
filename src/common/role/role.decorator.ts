import { SetMetadata } from '@nestjs/common';
import { USER_ROLE_TYPE } from '../constants/enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: USER_ROLE_TYPE[]) => SetMetadata(ROLES_KEY, roles);
