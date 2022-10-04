import { NonEmptyArray } from 'type-graphql';

import { CategoryResolver } from './resolvers/category/category-resolver';

// eslint-disable-next-line @typescript-eslint/ban-types
type Resolver = NonEmptyArray<Function> | NonEmptyArray<string>;

export const resolvers: Resolver = [CategoryResolver];
