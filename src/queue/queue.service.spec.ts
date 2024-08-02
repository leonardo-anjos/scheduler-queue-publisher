import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

describe('QueueService', () => {
  let service: QueueService;
  let mockChannel: Partial<amqp.Channel>;
  let mockConnection: Partial<amqp.Connection>;

  beforeEach(async () => {
    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue(undefined),
      sendToQueue: jest.fn().mockResolvedValue(undefined),
      purgeQueue: jest.fn().mockResolvedValue(undefined),
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel as amqp.Channel),
    };

    jest.spyOn(amqp, 'connect').mockResolvedValue(mockConnection as amqp.Connection);

    const mockConfigService = {
      get: jest.fn().mockReturnValue('amqp://localhost'),
    };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  describe('init', () => {
    it('should initialize connection and channel', async () => {
      await expect(service['init']()).resolves.not.toThrow();

      expect(amqp.connect).toHaveBeenCalledWith('amqp://localhost');
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith('appointments_queue', { durable: true });
    });
  });

  describe('addToQueue', () => {
    it('should add an appointment to the queue', async () => {
      const appointment = { id: 1, description: 'Test Appointment' };

      await service.addToQueue(appointment);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'appointments_queue',
        Buffer.from(JSON.stringify(appointment)),
        { persistent: true }
      );
    });
  });

  describe('clearQueue', () => {
    it('should clear the queue', async () => {
      await service.clearQueue();

      expect(mockChannel.purgeQueue).toHaveBeenCalledWith('appointments_queue');
    });
  });
});
