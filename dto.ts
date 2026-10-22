import { Field, InputType, Int } from '@nestjs/graphql';
import { ArrayMinSize, ArrayMaxSize, IsArray, IsEmail, IsInt, IsString, IsUUID, Length, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
@InputType()
export class LoginInput {
  @Field() @IsEmail() @Length(3,254) email: string;
  @Field() @IsString() @Length(10,72) password: string;
}
@InputType()
export class RegisterInput extends LoginInput {
  @Field() @IsString() @Length(2,80) name: string;
}
@InputType()
export class ProductInput {
  @Field() @IsString() @Length(3,100) name: string;
  @Field() @IsString() @Length(10,1000) description: string;
  @Field(() => Int) @IsInt() @Min(1) @Max(10000000) priceCents: number;
  @Field(() => Int) @IsInt() @Min(0) @Max(10000) stock: number;
  @Field() @IsUUID() categoryId: string;
}
@InputType()
export class OrderLineInput {
  @Field() @IsUUID() productId: string;
  @Field(() => Int) @IsInt() @Min(1) @Max(99) quantity: number;
}
@InputType()
export class CreateOrderInput {
  @Field() @IsUUID() requestKey: string;
  @Field(() => [OrderLineInput]) @IsArray() @ArrayMinSize(1) @ArrayMaxSize(30) @ValidateNested({each:true}) @Type(() => OrderLineInput) items: OrderLineInput[];
}
