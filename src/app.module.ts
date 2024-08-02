import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { QueueModule } from './queue/queue.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, 
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    QueueModule,
    SchedulingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
