export interface IPaymentService {
    createCheckoutSession(amount: number, orderId: string): Promise<{id: string}>
}