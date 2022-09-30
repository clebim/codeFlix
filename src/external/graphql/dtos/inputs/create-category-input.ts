import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateCategoryInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;
}
