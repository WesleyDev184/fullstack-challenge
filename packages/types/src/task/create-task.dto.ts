import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";
import { TaskPriorityEnum } from "./enums/task-priority.enum";
import { TaskStatusEnum } from "./enums/task-status.enum";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  dueAt: Date;

  @IsEnum(TaskPriorityEnum)
  @IsNotEmpty()
  priority: TaskPriorityEnum;

  @IsEnum(TaskStatusEnum)
  @IsNotEmpty()
  status: TaskStatusEnum;

  constructor(
    title: string,
    description: string,
    dueAt: Date,
    priority: TaskPriorityEnum,
    status: TaskStatusEnum
  ) {
    this.title = title;
    this.description = description;
    this.dueAt = dueAt;
    this.priority = priority;
    this.status = status;
  }
}
