import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // POST /sales/direct
  // Immediate, fully-paid sale — see SalesService.createDirectSale for
  // why this differs from the deposit/consignment order flow.
  @Post('direct')
  createDirectSale(@Body() dto: CreateSaleDto, @CurrentUser('id') userId: string) {
    return this.salesService.createDirectSale(dto, userId);
  }
}
