import { Controller, Get, Post, Body, UseGuards, Req, Query, Request, Delete, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(
    @Request() req,
    @Body() body: {
      questId: number;
      participants: number;
      bookingDate: string;
      name: string;
      phone: string;
    },
  ) {
   const userId = req.user.id;

    return this.orderService.createOrder(userId, {
      questId: body.questId,
      participants: body.participants,
      bookingDate: new Date(body.bookingDate),
      name: body.name,
      phone: body.phone,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getUserOrders(@Request() req) {
  const userId = req.user.id;
    return this.orderService.getUserOrders(userId);
  }

  @Get('booked')
  getBookedSlots(@Query('questId') questId: string, @Query('date') date: string) {
    return this.orderService.getBookedSlots(Number(questId), new Date(date));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteOrder(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.orderService.deleteOrder(userId, Number(id));
  }
}
