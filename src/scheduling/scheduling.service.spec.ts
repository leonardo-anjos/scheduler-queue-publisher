import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingService } from './scheduling.service';
import { HttpService } from '@nestjs/axios';
import { QueueService } from '../queue/queue.service';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('SchedulingService', () => {
  let service: SchedulingService;
  let queueService: QueueService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulingService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: QueueService,
          useValue: {
            addToQueue: jest.fn(),
            clearQueue: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SchedulingService>(SchedulingService);
    queueService = module.get<QueueService>(QueueService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('clearQueue', () => {
    it('should call clearQueue on QueueService', async () => {
      await service.clearQueue();
      expect(queueService.clearQueue).toHaveBeenCalled();
    });
  });

  describe('fetchAndQueueAppointments', () => {
    it('should fetch appointments and add them to the queue', async () => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const mockAppointments = [
        { id: 1, description: 'Test Appointment 1' },
        { id: 2, description: 'Test Appointment 2' },
      ];

      const mockResponse: AxiosResponse<any> = {
        data: mockAppointments,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined
        },
      };

      jest.spyOn(httpService, 'get').mockImplementation(() =>
        of(mockResponse),
      );

      await service.fetchAndQueueAppointments();

      expect(httpService.get).toHaveBeenCalledWith(
        `https://api.example.com/scheduling?date=${today}`,
      );
      expect(queueService.addToQueue).toHaveBeenCalledTimes(mockAppointments.length);
      mockAppointments.forEach((appointment) =>
        expect(queueService.addToQueue).toHaveBeenCalledWith(appointment),
      );
    });
  });
});
