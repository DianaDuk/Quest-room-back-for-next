import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  HttpCode,
} from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { PrismaService } from "src/prisma.service";
import { Request, Response } from "express";
import Stripe from "stripe";

@Controller("payment")
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  @Post("create-checkout-session")
async createCheckoutSession(@Body() body: { orderId: number }) {
  const order = await this.prisma.order.findUnique({
    where: { id: body.orderId },
    include: { quest: true },
  });

  if (!order) {
    throw new Error("Заказ не найден");
  }

  const amountUah = order.quest.amount ?? 0;
  const session = await this.stripeService.createCheckoutSession(
    amountUah,
    order.id.toString(),
  );

  await this.prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return { sessionId: session.id };
}

  @Post("webhook")
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request,
    @Headers("stripe-signature") sig: string,
  ) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed.", err.message);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
          const updated = await this.prisma.order.updateMany({
            where: { stripeSessionId: session.id },
            data: { paymentStatus: "paid" },
          });
          console.log(
            `✅ Order обновлён по sessionId=${session.id}, count=${updated.count}`,
          );
      } catch (error) {
        console.error("❌ Ошибка при обновлении заказа:", error);
      }
    }

    return { received: true }; 
  }
}
