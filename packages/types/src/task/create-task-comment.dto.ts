import { Type } from "class-transformer";
import { IsNotEmpty, IsObject, IsString, IsUUID } from "class-validator";

export class CreateTaskCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  constructor(content: string) {
    this.content = content;
  }
}

export class CreateCommentPayload {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;

  @IsNotEmpty()
  @IsObject()
  @Type(() => CreateTaskCommentDto)
  createCommentDto: CreateTaskCommentDto;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  constructor(
    taskId: string,
    createCommentDto: CreateTaskCommentDto,
    userId: string
  ) {
    this.taskId = taskId;
    this.createCommentDto = createCommentDto;
    this.userId = userId;
  }
}
