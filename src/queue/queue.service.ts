import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class QueueService {
  private readonly queueName = 'agendamentos_queue';
  private channel: amqp.Channel;

  constructor() {
    this.init();
  }

  private async init() {
    const connection = await amqp.connect('amqp://localhost');
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
  }

  async addToQueue(agendamento: any) {
    await this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(agendamento)), {
      persistent: true,
    });
  }

  async clearQueue() {
    await this.channel.purgeQueue(this.queueName);
  }
}
