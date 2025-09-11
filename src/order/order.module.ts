import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderDataService } from './order.data.service';
import { PrismaService } from 'src/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';


@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderDataService, PrismaService, StripeService],
})
export class OrderModule {}
