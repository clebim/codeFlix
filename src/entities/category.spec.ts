import { Category, CategoryProperties } from './category';

describe('Category Tests', () => {
  it('Test Constructor of category', () => {
    const newDate = new Date();
    const props: CategoryProperties = {
      name: 'Movie',
      description: 'Some description',
      isActive: true,
      createdAt: newDate,
    };

    const category = new Category(props);

    expect(category.props).toStrictEqual(props);
  });

  it('Test update category properties', () => {
    const newDate = new Date();
    const props: CategoryProperties = {
      name: 'Movie',
      isActive: true,
      createdAt: newDate,
    };

    const category = new Category(props);

    category.update({
      name: 'Matheus',
      isActive: false,
      description: 'Some description',
    });

    expect(category.props).toStrictEqual({
      name: 'Matheus',
      description: 'Some description',
      isActive: false,
      createdAt: newDate,
    });
  });
});
