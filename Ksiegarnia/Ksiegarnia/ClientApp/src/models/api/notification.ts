import { NotificationStatus } from "./notificationStatus";
import { NotificationType } from "./notificationType";
import UserDTO from "./userDTO";

export default interface Notification {
    id: string,
    objectId: string,
    description: string,
    status: NotificationStatus,
    type: NotificationType,
    creationDate: string,
    statusChangeDate: string
}