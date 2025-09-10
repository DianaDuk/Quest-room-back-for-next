import { Injectable } from '@nestjs/common';
import { OrderDataService } from './order.data.service';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly orderDataService: OrderDataService) {}

  createOrder(
    userId: number,
    data: {
      questId: number;
      participants: number;
      bookingDate: Date;
      name: string;
      phone: string;
    },
  ): Promise<Order> {

    return this.orderDataService.createOrder({ userId, ...data });
  }

  getUserOrders(userId: number): Promise<Order[]> {
    return this.orderDataService.getUserOrders(userId);
  }

  getBookedSlots(questId: number, date: Date): Promise<Date[]> {
    return this.orderDataService.getBookedSlots(questId, date);
  }

  deleteOrder(userId: number, orderId: number) {
    return this.orderDataService.deleteOrder(userId, orderId);
  }
}
