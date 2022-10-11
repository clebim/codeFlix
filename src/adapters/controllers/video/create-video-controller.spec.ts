import 'reflect-metadata';
import { createVideoUseCaseMock } from '@tests/mocks/use-case.mock';
import { makeCreateVideoMock } from '@tests/mocks/video/create-video.mock';
import { makeVideoMock } from '@tests/mocks/video/video.mock';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { CreateVideoRequest } from '@usecases/video/create-video-use-case';
import faker from 'faker';
import { mockReset } from 'jest-mock-extended';
import * as uuidApi from 'uuid';

import { HttpRequest } from '../port/http-request';
import { CreateVideoController } from './create-video-controller';

jest.mock('uuid');

let controller: CreateVideoController;
describe('Create category controller test', () => {
  beforeEach(() => {
    controller = new CreateVideoController(createVideoUseCaseMock);
    mockReset(createVideoUseCaseMock);
  });

  describe('When create category controller called', () => {
    it('and return created category', async () => {
      const uuid = '37e2aaaf-5998-42f6-9c10-6459e15692b3';
      jest.spyOn(uuidApi, 'v4').mockReturnValue(uuid);
      const createVideoRequest = makeCreateVideoMock({ userId: uuid });
      delete createVideoRequest.filename;
      delete createVideoRequest.thumbnail;

      const request: HttpRequest<CreateVideoRequest> = {
        body: {
          ...createVideoRequest,
        },
        files: [
          {
            filename: createVideoRequest.filename,
            encoding: faker.datatype.string(),
            fieldname: 'video',
            mimeType: faker.datatype.string(),
          },
          {
            filename: createVideoRequest.filename,
            encoding: faker.datatype.string(),
            fieldname: 'thumbnail',
            mimeType: faker.datatype.string(),
          },
        ],
      };

      const video = makeVideoMock().toDTO();
      const useCaseResponse = {
        isSuccess: true,
        isFailure: false,
        error: null,
        data: video,
      };

      createVideoUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      expect(response.body).toEqual(video);
      expect(response.statusCode).toEqual(201);
      expect(createVideoUseCaseMock.execute).toBeCalledTimes(1);
      expect(createVideoUseCaseMock.execute).toBeCalledWith({
        ...request.body,
        filename: request.files[0].filename,
        thumbnail: request.files[1].filename,
      });
    });

    it('and return a unprocessable entity', async () => {
      const uuid = '37e2aaaf-5998-42f6-9c10-6459e15692b3';
      jest.spyOn(uuidApi, 'v4').mockReturnValue(uuid);
      const createVideoRequest = makeCreateVideoMock({ userId: uuid });
      delete createVideoRequest.filename;
      delete createVideoRequest.thumbnail;

      const request: HttpRequest<CreateVideoRequest> = {
        body: {
          ...createVideoRequest,
        },
        files: [
          {
            filename: createVideoRequest.filename,
            encoding: faker.datatype.string(),
            fieldname: 'video',
            mimeType: faker.datatype.string(),
          },
          {
            filename: createVideoRequest.filename,
            encoding: faker.datatype.string(),
            fieldname: 'thumbnail',
            mimeType: faker.datatype.string(),
          },
        ],
      };

      const useCaseResponse = {
        isSuccess: false,
        isFailure: true,
        error: new InvalidDataError({
          filename: 'filename is required',
        }),
        data: null,
      };

      createVideoUseCaseMock.execute.mockResolvedValue(useCaseResponse);

      const response = await controller.handle(request);

      expect(response.body).toBeTruthy();
      expect(response.statusCode).toEqual(422);
      expect(createVideoUseCaseMock.execute).toBeCalledTimes(1);
      expect(createVideoUseCaseMock.execute).toBeCalledWith({
        ...request.body,
        filename: request.files[0].filename,
        thumbnail: request.files[1].filename,
      });
    });

    test('and return server error', async () => {
      const createVideoRequest = makeCreateVideoMock();

      const request: HttpRequest<CreateVideoRequest> = {
        body: {
          ...createVideoRequest,
        },
      };

      createVideoUseCaseMock.execute.mockRejectedValue(new Error('any error'));

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        message: 'Internal server error',
      });
    });
  });
});
