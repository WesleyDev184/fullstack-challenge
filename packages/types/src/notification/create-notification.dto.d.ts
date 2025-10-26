import { NotificationCategoryEnum } from "./enums/notification-category.enum";
export declare class CreateNotificationDto {
    recipientId: string;
    title: string;
    content: string;
    category: NotificationCategoryEnum;
    assigneeIds?: string[];
    constructor(recipientId: string, title: string, content: string, category: NotificationCategoryEnum, assigneeIds?: string[]);
}
//# sourceMappingURL=create-notification.dto.d.ts.map