import { Injectable } from "@nestjs/common";
import { StripeService } from "src/stripe/stripe.service";
import { IPaymentService } from "./payment.interface";

@Injectable()
export class PaymentFactory {
    constructor(
        private readonly stripeService: StripeService,
    ) {}

    getPaymentService(provider: string): IPaymentService {
        switch (provider) {
            case "stripe": 
            return this.stripeService;
            default:
                throw new Error(`Unknown payment provider: ${provider}`);
        }
    }
}