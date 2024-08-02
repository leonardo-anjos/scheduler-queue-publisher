import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueService {
  private readonly queueName = 'appointments_queue';
  private channel: amqp.Channel;

  constructor(private readonly configService: ConfigService) {
    this.init();
  }

  private async init() {
    const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL', 'amqp://localhost');
    const connection = await amqp.connect(rabbitmqUrl);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
  }

  async addToQueue(appointment: any) {
    await this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(appointment)), {
      persistent: true,
    });
  }

  async clearQueue() {
    await this.channel.purgeQueue(this.queueName);
  }
}
