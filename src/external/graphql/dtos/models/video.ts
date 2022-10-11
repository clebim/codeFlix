import { Field, ObjectType } from 'type-graphql';

import { User } from './user';

@ObjectType()
export class Video {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  public: boolean;

  @Field({ nullable: true })
  thumbnail: string;

  @Field()
  filename: string;

  @Field()
  likes: number;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  createdAt: Date;
}
