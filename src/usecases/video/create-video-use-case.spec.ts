import 'reflect-metadata';
import { Video } from '@entities/video';
import { makeCategoryListMock } from '@tests/mocks/category/category-list';
import {
  categoryRepositoryMock,
  videoRepositoryMock,
} from '@tests/mocks/repository.mock';
import { loggerMock } from '@tests/mocks/service.mock';
import { createVideoValidatorMock } from '@tests/mocks/validator.mock';
import { makeCreateVideoMock } from '@tests/mocks/video/create-video.mock';
import { InvalidDataError } from '@usecases/errors/invalid-data-error';
import { UseCase } from '@usecases/port/use-case';
import faker from 'faker';
import { mockReset } from 'jest-mock-extended';
import * as uuidApi from 'uuid';

import {
  CreateVideoRequest,
  CreateVideoResponse,
  CreateVideoUseCase,
} from './create-video-use-case';

let useCase: UseCase<CreateVideoRequest, CreateVideoResponse>;

jest.mock('uuid');
describe('Create video use case test', () => {
  beforeEach(() => {
    mockReset(loggerMock);
    mockReset(categoryRepositoryMock);
    mockReset(createVideoValidatorMock);
    mockReset(videoRepositoryMock);
    jest.clearAllMocks();
    useCase = new CreateVideoUseCase(
      loggerMock,
      videoRepositoryMock,
      categoryRepositoryMock,
      createVideoValidatorMock,
    );
  });

  describe('When create video is called', () => {
    it('and should return the new category', async () => {
      const request = makeCreateVideoMock();
      const { categoriesId } = request;
      const uuid = faker.datatype.uuid();

      jest.useFakeTimers().setSystemTime(new Date());
      createVideoValidatorMock.validate.mockReturnValue({
        isValid: true,
        value: request,
      });
      jest.spyOn(uuidApi, 'v4').mockReturnValue(uuid);
      const categoriesList = makeCategoryListMock();
      categoryRepositoryMock.listCategory.mockResolvedValue(categoriesList);
      const categoryPlainList = categoriesList.map(category =>
        category.toDTO(),
      );
      const videoEntity = new Video({
        ...request,
        categories: categoryPlainList,
      });
      videoRepositoryMock.save.mockResolvedValue(videoEntity);

      const response = await useCase.execute(request);

      expect(response).toBeTruthy();
      expect(createVideoValidatorMock.validate).toBeCalledTimes(1);
      expect(createVideoValidatorMock.validate).toBeCalledWith(request);
      expect(categoryRepositoryMock.listCategory).toBeCalledTimes(1);
      expect(categoryRepositoryMock.listCategory).toBeCalledWith({
        id: categoriesId,
        isActive: true,
      });
      expect(response.data).toEqual({
        id: uuid,
        categories: categoryPlainList,
        title: request.title,
        thumbnail: request.thumbnail,
        public: true,
        filename: request.filename,
        likes: 0,
        userId: request.userId,
        description: request.description,
        createdAt: new Date(),
      });
    });

    describe('and get a error because', () => {
      it('invalid request body', async () => {
        const request = makeCreateVideoMock();

        createVideoValidatorMock.validate.mockReturnValue({
          isValid: false,
          value: request,
          invalidFields: [],
        });

        const response = await useCase.execute(request);

        expect(response).toBeTruthy();
        expect(response.isFailure).toBeTruthy();
        expect(response.error).toBeInstanceOf(InvalidDataError);
        expect(createVideoValidatorMock.validate).toBeCalledTimes(1);
        expect(createVideoValidatorMock.validate).toBeCalledWith(request);
        expect(categoryRepositoryMock.listCategory).toBeCalledTimes(0);
        expect(videoRepositoryMock.save).toBeCalledTimes(0);
        expect(response.data).not.toBeTruthy();
      });

      it('fatal error in category repository', async () => {
        const request = makeCreateVideoMock();
        const error = new Error('Fatal Error');

        createVideoValidatorMock.validate.mockReturnValue({
          isValid: true,
          value: request,
        });
        categoryRepositoryMock.listCategory.mockRejectedValue(error);

        try {
          await useCase.execute(request);
        } catch (error) {
          expect(loggerMock.error).toBeCalledTimes(1);
          expect(loggerMock.error).toBeCalledWith(error);
          expect(createVideoValidatorMock.validate).toBeCalledTimes(1);
          expect(createVideoValidatorMock.validate).toBeCalledWith(request);
          expect(categoryRepositoryMock.listCategory).toBeCalledTimes(1);
          expect(videoRepositoryMock.save).toBeCalledTimes(0);
          expect(error.message).toBe('Fatal Error');
          expect(error).toBeInstanceOf(Error);
        }
      });
    });
  });
});
