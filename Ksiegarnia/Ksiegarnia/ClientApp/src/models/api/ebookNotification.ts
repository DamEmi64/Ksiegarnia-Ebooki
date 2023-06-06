import { EbookNotificationStatus } from "./ebookNotificationStatus";
import UserDTO from "./userDTO";

export default interface EbookNotification {
    id: string,
    objectId: string,
    description: string,
    user: UserDTO,
    status: EbookNotificationStatus,
    creationDate: string,
    statusChangeDate: string
}