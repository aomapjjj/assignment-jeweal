import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardQueryDto } from './{dto}/dashboard-query.dto';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // GET /dashboard/summary?from=&to=  (defaults to today)
  @Get('summary')
  getSummary(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getSummary(query);
  }

  // GET /dashboard/low-stock?threshold=2
  @Get('low-stock')
  getLowStock(@Query('threshold', new ParseIntPipe({ optional: true })) threshold?: number) {
    return this.dashboardService.getLowStockAlerts(threshold);
  }

  // GET /dashboard/recent-sales?limit=10
  @Get('recent-sales')
  getRecentSales(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.dashboardService.getRecentSales(limit);
  }
}
