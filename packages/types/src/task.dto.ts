import { Expose, Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export class TaskDto {
  @Expose()
  @IsUUID()
  id!: string;

  @Expose()
  @IsString()
  title!: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsEnum(TaskStatus)
  status!: TaskStatus;

  @Expose()
  @IsUUID()
  userId!: string;

  @Expose()
  @Transform(({ value }: { value: string }) => new Date(value))
  createdAt!: Date;

  @Expose()
  @Transform(({ value }: { value: string }) => new Date(value))
  updatedAt!: Date;
}
