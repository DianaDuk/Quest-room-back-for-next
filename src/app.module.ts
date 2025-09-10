import { Module } from '@nestjs/common';
import { QuestModel } from './quest/quest.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { OtpModule } from './otp/otp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false, 
    }),

    QuestModel, 
    AuthModule, 
    OrderModule, 
    OtpModule,
    StripeModule
  ],
})
export class AppModule {}
