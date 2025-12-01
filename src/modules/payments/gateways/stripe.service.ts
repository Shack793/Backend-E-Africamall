import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-10-29.clover', 
    });
  }

  async createPaymentIntent(amount: number, currency: string = 'usd', metadata: any = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), 
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      };
    } catch (error) {
      throw new BadRequestException(`Stripe error: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentIntent,
        };
      }

      return {
        success: false,
        paymentIntent,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to confirm payment: ${error.message}`);
    }
  }

  async createRefund(paymentIntentId: string, amount?: number) {
    try {
      const refundParams: any = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundParams.amount = Math.round(amount * 100);
      }

      const refund = await this.stripe.refunds.create(refundParams);
      return refund;
    } catch (error) {
      throw new BadRequestException(`Failed to create refund: ${error.message}`);
    }
  }


  async handleWebhook(payload: Buffer, signature: string, webhookSecret: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return event;
    } catch (error) {
      throw new BadRequestException(`Webhook error: ${error.message}`);
    }
  }
}