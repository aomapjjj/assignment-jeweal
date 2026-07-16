import { IsDateString, IsOptional } from 'class-validator';

/**
 * Optional date range for dashboard queries. When omitted, services
 * default to "today" (summary) or "last 30 days" (trends) — each
 * endpoint documents its own default rather than silently returning
 * all-time data, which would be misleading on a "dashboard".
 */
export class DashboardQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
