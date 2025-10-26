import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
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
  @Type(() => Date)
  @IsDate()
  dueAt?: Date;

  @IsOptional()
  @IsEnum(TaskPriorityEnum)
  priority?: TaskPriorityEnum;

  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  assigneeIds?: string[];

  constructor(
    id?: string,
    title?: string,
    description?: string,
    dueAt?: Date,
    priority?: TaskPriorityEnum,
    status?: TaskStatusEnum,
    assigneeIds?: string[]
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueAt = dueAt;
    this.priority = priority;
    this.status = status;
    this.assigneeIds = assigneeIds;
  }
}

export class UpdateTaskPayload {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsObject()
  @Type(() => UpdateTaskDto)
  @IsNotEmpty()
  updateTaskDto: UpdateTaskDto;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  constructor(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    this.id = id;
    this.updateTaskDto = updateTaskDto;
    this.userId = userId;
  }
}
