import { Video, VideoConstructorProperties } from '@entities/video';
import { changeValuesMock } from '@tests/helper/mock-helper.mock';

import { makeVideoMock } from './video.mock';

export const makeListVideosMock = (
  valueHasToBeReplaced?: Partial<VideoConstructorProperties[]>,
  replaceInsideListObject = true,
) =>
  changeValuesMock<Video[]>(
    [makeVideoMock(), makeVideoMock(), makeVideoMock(), makeVideoMock()],
    valueHasToBeReplaced,
    replaceInsideListObject,
  );
