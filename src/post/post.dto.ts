import { IsNotEmpty, IsEmail, IsString, IsNumber, IsUrl, MinLength } from 'class-validator';

export class PostDto {
  //@IsNotEmpty() @IsString() userId: string;
  @IsNotEmpty() @IsString() postTitle: string;
  @IsNotEmpty() @IsString() text: string;
  @IsUrl() photoURL?: string;
}

export class UpdatePostDto {
  @IsString() postTitle: string;
  @IsString() text: string;
  @IsUrl() photoURL?: string;
}

export class PostQueryDto {
  @IsString() postTitle: string;
  @IsString() text: string;
  @IsUrl() photoURL?: string;
}