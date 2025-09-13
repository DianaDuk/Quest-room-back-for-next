import { Injectable } from '@nestjs/common';
import { OrderDataService } from './order.data.service';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { PaymentFactory } from 'src/payment/payment.factory';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderDataService: OrderDataService,
    private readonly paymentFactory: PaymentFactory,
    private readonly prisma: PrismaService,
  ) {}

async createOrder(
    userId: number,
    data: {
      questId: number;
      participants: number;
      bookingDate: Date;
      name: string;
      phone: string;
    },
  ): Promise<{order: Order; sessionId: string}> {

    const order = await this.orderDataService.createOrder({ userId, ...data });

    const quest = await this.prisma.quest.findUnique({where: {id: data.questId}});
    const amountUah = quest?.amount ?? 0;

    const paymentService = this.paymentFactory.getPaymentService("stripe");

    const session = await paymentService.createCheckoutSession(amountUah, order.id.toString());

    await this.prisma.order.update({
      where: {id: order.id},
      data: {stripeSessionId: session.id},
    });

    return {order, sessionId:session.id};
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
