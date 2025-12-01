import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    this.baseUrl = this.configService.get<string>('PAYPAL_BASE_URL') || 'https://api-m.sandbox.paypal.com';

    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials are not defined in environment variables');
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new BadRequestException(`PayPal auth error: ${data.error_description}`);
    }

    return data.access_token;
  }

  async createOrder(amount: number, currency: string = 'USD') {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: amount.toString(),
              },
            },
          ],
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new BadRequestException(`PayPal error: ${data.message}`);
      }

      return data;
    } catch (error) {
      throw new BadRequestException(`Failed to create PayPal order: ${error.message}`);
    }
  }

  async captureOrder(orderId: string) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new BadRequestException(`PayPal capture error: ${data.message}`);
      }

      return data;
    } catch (error) {
      throw new BadRequestException(`Failed to capture PayPal order: ${error.message}`);
    }
  }
}