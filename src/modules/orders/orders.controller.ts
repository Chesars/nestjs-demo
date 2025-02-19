import { Controller, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrderDto';
import { OrdersService } from './orders.service';
import { Get, Param } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/createOrderDetailDto';
import { AuthGuard } from '../auth/guards/auth.guard.middleware';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  getOrder(@Param('id', ParseUUIDPipe) id: string ) {
    return this.ordersService.getOrder(id);
  }
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post(':id')
  addOrder(@Param('id', ParseUUIDPipe) id: string ,@Body() order: CreateOrderDetailDto) {
    return this.ordersService.addOrder(id,order);
  }
  

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  } */
}
