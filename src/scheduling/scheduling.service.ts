import { HttpService, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class SchedulingService {
  private readonly apiUrl = 'https://api.example.com/scheduling';

  constructor(
    private readonly httpService: HttpService,
    private readonly queueService: QueueService,
  ) {}

  @Cron('0 0 * * *') // Executa à meia-noite
  async clearQueue() {
    await this.queueService.clearQueue();
  }

  @Cron('0 0 * * * *') // Executa a cada minuto (para fins de demonstração)
  async fetchAndQueueAgendamentos() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const response = await this.httpService.get(`${this.apiUrl}?date=${today}`).toPromise();
    const agendamentos = response.data;

    for (const agendamento of agendamentos) {
      await this.queueService.addToQueue(agendamento);
    }
  }
}
