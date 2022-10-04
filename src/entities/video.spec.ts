import faker from 'faker';

import { Category } from './category';
import { Video, VideoConstructorProperties } from './video';

describe('Video Tests', () => {
  it('Test Constructor of Video', () => {
    const props: VideoConstructorProperties = {
      userId: faker.datatype.uuid(),
      title: faker.datatype.string(),
      url: faker.datatype.string(),
      categories: [
        {
          id: faker.datatype.uuid(),
          name: faker.datatype.string(),
        },
      ],
    };

    const video = new Video(props);

    expect(video.id).toBeTruthy();
    expect(video.props).toHaveProperty('title');
    expect(video.props).toHaveProperty('userId');
    expect(video.props).toHaveProperty('url');
    expect(video.props.public).toBeTruthy();
    expect(video.props.description).toBeNull();
    expect(video.props.thumbnail).toBeNull();
    expect(video.props).toHaveProperty('createdAt');
    expect(video.props.categories[0]).toBeInstanceOf(Category);
  });

  it('Test update category properties', () => {
    const props = {
      userId: faker.datatype.uuid(),
      title: faker.datatype.string(),
      url: faker.datatype.string(),
      categories: [
        {
          id: faker.datatype.uuid(),
          name: faker.datatype.string(),
        },
      ],
    };

    const video = new Video(props);

    video.update({
      title: 'Titulo',
      url: 'Teste',
    });

    expect(video.props.title).toEqual('Titulo');
    expect(video.props.url).toEqual('Teste');
  });
});
