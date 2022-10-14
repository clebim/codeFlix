import 'reflect-metadata';
import { videoRepositoryMock } from '@tests/mocks/repository.mock';
import { loggerMock } from '@tests/mocks/service.mock';
import { listVideosValidatorMock } from '@tests/mocks/validator.mock';
import { makeListVideosMock } from '@tests/mocks/video/list-videos.mock';
import { UseCase } from '@usecases/port/use-case';
import { subDays } from 'date-fns';
import { mockReset } from 'jest-mock-extended';

import { convertZonedTimeToUtc } from '@shared/domain/zoned-time-to-utc';

import {
  ListVideosRequest,
  ListVideosResponse,
  ListVideosUseCase,
} from './list-videos-use-case';

let useCase: UseCase<ListVideosRequest, ListVideosResponse>;

describe('List Video use case test', () => {
  beforeEach(() => {
    mockReset(loggerMock);
    mockReset(videoRepositoryMock);
    mockReset(listVideosValidatorMock);
    jest.clearAllMocks();
    useCase = new ListVideosUseCase(
      loggerMock,
      videoRepositoryMock,
      listVideosValidatorMock,
    );
  });
  describe('When list video is called', () => {
    it('and should return a list of videos with empty request', async () => {
      const videosList = makeListVideosMock();
      const request: ListVideosRequest = {};

      listVideosValidatorMock.validate.mockReturnValue({
        isValid: true,
        value: request,
      });
      videoRepositoryMock.listVideos.mockResolvedValue({
        videos: videosList,
        count: videosList.length,
      });
      jest.useFakeTimers().setSystemTime(new Date());

      const { data, isFailure } = await useCase.execute(request);

      expect(isFailure).not.toBeTruthy();
      expect(data.totalItems).toBe(videosList.length);
      expect(data.page).toBe(1);
      expect(data.totalPages).toBe(1);
      expect(videoRepositoryMock.listVideos).toBeCalledTimes(1);
      expect(videoRepositoryMock.listVideos).toBeCalledWith({
        finalDate: convertZonedTimeToUtc(new Date()),
        initialDate: convertZonedTimeToUtc(subDays(new Date(), 7)),
        order: 'DESC',
        orderBy: 'likes',
        skip: 0,
        take: 10,
      });
    });

    it('and should return a list of videos with request', async () => {
      const videosList = makeListVideosMock();
      const request: ListVideosRequest = {
        page: 3,
        order: 'ASC',
        orderBy: 'createdAt',
        totalItemsPerPage: 5,
      };

      listVideosValidatorMock.validate.mockReturnValue({
        isValid: true,
        value: request,
      });
      videoRepositoryMock.listVideos.mockResolvedValue({
        videos: videosList,
        count: 37,
      });
      jest.useFakeTimers().setSystemTime(new Date());

      const { data, isFailure } = await useCase.execute(request);

      expect(isFailure).not.toBeTruthy();
      expect(data.totalItems).toBe(37);
      expect(data.page).toBe(3);
      expect(data.totalPages).toBe(8);
      expect(videoRepositoryMock.listVideos).toBeCalledTimes(1);
      expect(videoRepositoryMock.listVideos).toBeCalledWith({
        finalDate: convertZonedTimeToUtc(new Date()),
        initialDate: convertZonedTimeToUtc(subDays(new Date(), 7)),
        order: 'ASC',
        orderBy: 'createdAt',
        skip: 10,
        take: 5,
      });
    });
  });
});
