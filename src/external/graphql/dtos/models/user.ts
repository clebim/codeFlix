import { Field, ObjectType } from 'type-graphql';

import { Video } from './video';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  photo: string;

  @Field()
  isActive: boolean;

  @Field(() => [Video])
  videos: Video[];

  @Field()
  createdAt: Date;
}
