import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RequestUser } from '../decorators/current user.decorator';

/**
 * Reads the roles set by @Roles(...) and checks them against
 * request.user.role. Must run AFTER JwtAuthGuard in the guard chain
 * (@UseGuards(JwtAuthGuard, RolesGuard)) — it relies on request.user
 * already being populated and does not itself verify the JWT.
 *
 * Routes with no @Roles() metadata pass through unrestricted (any
 * authenticated user may access them) — role restriction is opt-in per
 * route, not the default.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      UserRole[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: RequestUser | undefined = request.user;

    if (!user) {
      // Should not happen if JwtAuthGuard ran first — treat as a hard
      // deny rather than silently allowing through.
      throw new ForbiddenException('Authentication required');
    }

    const allowed = requiredRoles.includes(user.role);
    if (!allowed) {
      throw new ForbiddenException(
        `Role ${user.role} is not permitted to perform this action`,
      );
    }

    return true;
  }
}
