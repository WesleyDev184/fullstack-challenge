import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { NotificationCategoryEnum } from "./enums/notification-category.enum";

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(NotificationCategoryEnum)
  category: NotificationCategoryEnum;

  @IsNotEmpty({ each: true })
  @IsUUID("4", { each: true })
  @IsOptional()
  assigneeIds: string[];

  constructor(
    title: string,
    content: string,
    category: NotificationCategoryEnum,
    assigneeIds: string[]
  ) {
    this.title = title;
    this.content = content;
    this.category = category;
    this.assigneeIds = assigneeIds;
  }
}
