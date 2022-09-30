import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Category {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;
}
