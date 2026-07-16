import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Marks a route/controller as restricted to the given roles.
 * Must be paired with @UseGuards(RolesGuard) — the decorator only
 * attaches metadata, it doesn't enforce anything by itself.
 *
 * Usage:
 *   @Roles(UserRole.ADMIN)
 *   @Patch(':id/stock')
 *   adjustStock(...) { ... }
 *
 * A route with no @Roles() decorator is accessible to any authenticated
 * user (RolesGuard treats "no metadata" as "no restriction").
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);