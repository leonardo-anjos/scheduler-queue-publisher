import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SchedulingService } from './scheduling.service';
import { QueueService } from '../queue/queue.service';

@Module({
  imports: [
    HttpModule,  
  ],
  providers: [
    SchedulingService,
    QueueService,
  ],
  exports: [
    SchedulingService,
  ],
})
export class SchedulingModule {}
