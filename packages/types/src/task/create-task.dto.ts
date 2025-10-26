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

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueAt?: Date;

  @IsEnum(TaskPriorityEnum)
  @IsOptional()
  priority?: TaskPriorityEnum;

  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: TaskStatusEnum;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  assigneeIds?: string[];

  constructor(
    title: string,
    description?: string,
    dueAt?: Date,
    priority?: TaskPriorityEnum,
    status?: TaskStatusEnum,
    assigneeIds?: string[]
  ) {
    this.title = title;
    this.description = description;
    this.dueAt = dueAt;
    this.priority = priority;
    this.status = status;
    this.assigneeIds = assigneeIds;
  }
}

export class CreateTaskPayload {
  @IsObject()
  @IsNotEmpty()
  @Type(() => CreateTaskDto)
  createTaskDto: CreateTaskDto;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  constructor(createTaskDto: CreateTaskDto, userId: string) {
    this.createTaskDto = createTaskDto;
    this.userId = userId;
  }
}

export class RemoveTaskPayload {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  constructor(id: string, userId: string) {
    this.id = id;
    this.userId = userId;
  }
}
