import { NotificationStatus } from "./notificationStatus";
import UserDTO from "./userDTO";

export default interface Notification {
    id: string,
    objectId: string,
    description: string,
    user: UserDTO,
    status: NotificationStatus,
    creationDate: string,
    statusChangeDate: string
}