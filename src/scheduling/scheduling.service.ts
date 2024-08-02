import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QueueService } from '../queue/queue.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SchedulingService {
  private readonly apiUrl = 'https://api.example.com/scheduling';

  constructor(
    private readonly httpService: HttpService,
    private readonly queueService: QueueService,
  ) {}

  @Cron('0 0 * * *') // Runs at midnight
  async clearQueue() {
    await this.queueService.clearQueue();
  }

  @Cron('0 0 * * * *') // Runs every minute
  async fetchAndQueueAppointments() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const response = await this.httpService.get(`${this.apiUrl}?date=${today}`).toPromise();
    const appointments = response.data;

    for (const appointment of appointments) {
      await this.queueService.addToQueue(appointment);
    }
  }
}
