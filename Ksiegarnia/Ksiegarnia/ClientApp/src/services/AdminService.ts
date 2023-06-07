import axios from "axios";
import { Role } from "../models/api/role";
import Notification from "../models/api/notification";
import { NotificationStatus } from "../models/api/notificationStatus";
import UserDTO from "../models/api/userDTO";

export interface CreateNotitifaction {
  objectId: string;
  description: string;
  user: UserDTO;
  status: NotificationStatus;
  creationDate: string;
  statusChangeDate: string;
}

class AdminService {
  private api = `${process.env.REACT_APP_API}/Admin`;

  addRoleToUser(userId: string, role: Role) {
    return axios.put(`${this.api}/User/${userId}/${role}`);
  }

  removeRoleFromUser(userId: string, role: Role) {
    return axios.delete(`${this.api}/User/${userId}/${role}`);
  }

  getNotificationById(notificationId: string) {
    return axios.get(`${this.api}/Notification/${notificationId}`);
  }

  getAllNotifications() {
    return axios.get(`${this.api}/Notification`);
  }

  createNotification(request: CreateNotitifaction) {
    return axios.post(`${this.api}/Notify`, request);
  }

  changeNotificationStatus(
    notificationId: string,
    status: NotificationStatus
  ) {
    return axios.post(`${this.api}/Notification/${notificationId}/${status}`);
  }
}

export default new AdminService();
