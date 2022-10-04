import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateCategoryInput {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  isActive: boolean;
}
