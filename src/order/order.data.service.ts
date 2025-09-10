import { Injectable, BadRequestException } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderDataService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: {
    userId: number;
    questId: number;
    participants: number;
    bookingDate: Date;
    name: string;
    phone: string;
  }): Promise<Order> {

    const existing = await this.prisma.order.findFirst({
      where: {
        questId: data.questId,
        bookingDate: data.bookingDate,
      },
    });

    if (existing) {
      throw new BadRequestException('Этот слот уже занят');
    }

    return this.prisma.order.create({ data });
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { bookingDate: 'asc' },
      include: { quest: true }, 
    });
  }

  async getBookedSlots(questId: number, date: Date): Promise<Date[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await this.prisma.order.findMany({
      where: {
        questId,
        bookingDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: { bookingDate: true },
    });

    return orders.map(o => o.bookingDate);
  }

  async deleteOrder(userId: number, orderId: number) {
    const order = await this.prisma.order.findUnique({where: {id: orderId}});

    if(!order) {
      throw new BadRequestException('Заказ не найден');
    }

    if(order.userId !== userId) {
      throw new BadRequestException('Вы не можете отменить чужой заказ');
    }

    return this.prisma.order.delete({
      where: {id: orderId},
    });
  }
}

