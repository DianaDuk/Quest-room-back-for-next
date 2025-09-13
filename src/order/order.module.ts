import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderDataService } from './order.data.service';
import { PrismaService } from 'src/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import { PaymentFactory } from 'src/payment/payment.factory';


@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderDataService, PrismaService, StripeService, PaymentFactory],
})
export class OrderModule {}
