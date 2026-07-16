import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Shape attached to `request.user` by JwtStrategy.validate() in the auth
 * module (Sprint 2). Kept here so both the decorator and any controller
 * using it agree on the shape without importing the whole auth module.
 */
export interface RequestUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'SALES';
}

/**
 * Pulls the authenticated user off the request, populated by JwtAuthGuard
 * (which must run before this decorator is used — routes without
 * @UseGuards(JwtAuthGuard) will have `request.user` undefined).
 *
 * Usage:
 *   @CurrentUser() user: RequestUser        // whole user object
 *   @CurrentUser('id') userId: string        // just one field
 */
export const CurrentUser = createParamDecorator(
  (field: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: RequestUser | undefined = request.user;

    if (!user) {
      // Guard against misuse: if this fires, JwtAuthGuard wasn't applied
      // to the route, which is a wiring bug, not a runtime auth failure.
      return undefined;
    }

    return field ? user[field] : user;
  },
);