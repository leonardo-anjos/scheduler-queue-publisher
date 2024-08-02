import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [SchedulingService],
})
export class SchedulingModule {}
