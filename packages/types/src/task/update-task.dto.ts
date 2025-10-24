import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";
import { TaskPriorityEnum } from "./enums/task-priority.enum";
import { TaskStatusEnum } from "./enums/task-status.enum";

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  dueAt?: Date;

  @IsOptional()
  @IsEnum(TaskPriorityEnum)
  priority?: TaskPriorityEnum;

  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;

  constructor(
    id?: string,
    title?: string,
    description?: string,
    dueAt?: Date,
    priority?: TaskPriorityEnum,
    status?: TaskStatusEnum
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueAt = dueAt;
    this.priority = priority;
    this.status = status;
  }
}
