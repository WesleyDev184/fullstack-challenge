import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  constructor(
    id: string,
    username?: string,
    email?: string,
    password?: string
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
