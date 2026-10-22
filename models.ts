import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
@ObjectType()
export class UserModel {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() email: string;
  @Field() role: string;
}
@ObjectType()
export class AuthPayload {
  @Field() accessToken: string;
  @Field(() => UserModel) user: UserModel;
}
@ObjectType()
export class CategoryModel {
  @Field(() => ID) id: string;
  @Field() name: string;
}
@ObjectType()
export class ProductModel {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() description: string;
  @Field(() => Int) priceCents: number;
  @Field(() => Int) stock: number;
  @Field() categoryId: string;
  @Field(() => CategoryModel) category: CategoryModel;
}
@ObjectType()
export class OrderItemModel {
  @Field() productId: string;
  @Field() name: string;
  @Field(() => Int) quantity: number;
  @Field(() => Int) priceCents: number;
}
@ObjectType()
export class OrderModel {
  @Field(() => ID) id: string;
  @Field() status: string;
  @Field(() => Int) totalCents: number;
  @Field(() => Date) createdAt: Date;
  @Field(() => [OrderItemModel]) items: OrderItemModel[];
}
