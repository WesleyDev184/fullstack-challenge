import { Expose, Transform } from "class-transformer";
import { IsEnum, IsString, IsUUID } from "class-validator";

export enum NotificationType {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
}

export class NotificationDto {
  @Expose()
  @IsUUID()
  id!: string;

  @Expose()
  @IsString()
  title!: string;

  @Expose()
  @IsString()
  message!: string;

  @Expose()
  @IsEnum(NotificationType)
  type!: NotificationType;

  @Expose()
  @IsUUID()
  userId!: string;

  @Expose()
  @Transform(({ value }: { value: string }) => new Date(value))
  createdAt!: Date;

  @Expose()
  @Transform(({ value }: { value: string }) => new Date(value))
  sentAt?: Date;
}
