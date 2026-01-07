import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '',
      {
        apiVersion: '2025-12-15.clover',
      });
  }

  // ----------------------------
  // Création d'un PaymentIntent
  // ----------------------------
  async createPaymentIntent(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true, payment: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'PENDING') throw new BadRequestException('Order is not pending');

    // Payment existant ?
    if (order.payment?.stripePaymentIntentId) {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        order.payment.stripePaymentIntentId,
      );
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    }

    // Nouveau PaymentIntent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // en centimes
      currency: 'eur',
      metadata: { orderId: order.id, userId },
      automatic_payment_methods: { enabled: true },
    });

    // Enregistrer le paiement
    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: order.totalAmount,
        status: 'PENDING',
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  // ----------------------------
  // Gestion Webhook Stripe
  // ----------------------------
  async handleWebhook(signature: string, rawBody: Buffer | undefined) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error('Webhook secret not configured');
    if (!rawBody) throw new BadRequestException('Request body is required');

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody as Buffer, signature, webhookSecret);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(`Webhook Error: ${err.message}`);
      }
      throw new BadRequestException('Webhook Error: Unknown error');
    }

    // Gestion des événements
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  // ----------------------------
  // Payment réussi
  // ----------------------------
  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
      include: { order: true },
    });

    if (!payment) {
      console.error(`Payment not found for PaymentIntent: ${paymentIntent.id}`);
      return;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCEEDED' },
    });

    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'PAID' },
    });

    console.log(`✅ Payment succeeded for order: ${payment.orderId}`);
  }

  // ----------------------------
  // Payment échoué
  // ----------------------------
  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
      include: { order: true },
    });

    if (!payment) {
      console.error(`Payment not found for PaymentIntent: ${paymentIntent.id}`);
      return;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });

    console.log(`❌ Payment failed for order: ${payment.orderId}`);
  }

  // ----------------------------
  // Vérifier le statut d’un paiement
  // ----------------------------
  async getPaymentStatus(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { payment: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (!order.payment) throw new NotFoundException('Payment not found for this order');

    return {
      orderId: order.id,
      paymentStatus: order.payment.status,
      orderStatus: order.status,
      amount: order.totalAmount,
    };
  }
}
