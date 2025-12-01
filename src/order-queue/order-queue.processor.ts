import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('order')
export class OrderQueueProcessor extends WorkerHost {
  async process(job: Job<any>): Promise<any> {
    console.log(`Processing job: ${job.id}`, job.data);

    // Example: simulate sending email
    const { orderId, email } = job.data;
    console.log(`📧 Sending order confirmation to ${email} for Order #${orderId}`);

    // You can integrate actual mailer service here
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('✅ Email sent successfully!');
    return true;
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`🎉 Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(`❌ Job ${job.id} failed:`, err.message);
  }
}
