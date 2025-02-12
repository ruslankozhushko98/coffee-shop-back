import { SetMetadata } from '@nestjs/common';
import { ROLES } from '@prisma/client';

export const Roles = (...roles: Array<ROLES>) => SetMetadata('roles', roles);
