import { Type } from "class-transformer";
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from "class-validator";

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 10;
}

export class PaginatedResponseDto<T> {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  data: T[];

  constructor(data: T[], page: number, size: number, total: number) {
    this.data = data;
    this.page = page;
    this.size = size;
    this.total = total;
    this.totalPages = Math.ceil(total / size);
  }
}

export class FindAllTasksPayload {
  @IsNumber()
  @IsOptional()
  page?: number;
  @IsNumber()
  @IsOptional()
  size?: number;

  constructor(paginationDto: PaginationDto) {
    this.page = paginationDto.page;
    this.size = paginationDto.size;
  }
}

export class GetCommentsPayload {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;

  @IsNumber()
  @IsOptional()
  page?: number;
  @IsNumber()
  @IsOptional()
  size?: number;

  constructor(taskId: string, paginationDto?: PaginationDto) {
    this.taskId = taskId;
    this.page = paginationDto?.page;
    this.size = paginationDto?.size;
  }
}
