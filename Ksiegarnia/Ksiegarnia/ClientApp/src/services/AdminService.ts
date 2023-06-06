import axios from "axios";
import { Role } from "../models/api/role";

class AdminService {
  private api = `${process.env.REACT_APP_API}/Admin`;

  addRoleToUser(userId: string, role: Role) {
    return axios.put(`${this.api}/User/${userId}/${role}`);
  }

  removeRoleFromUser(userId: string, role: Role) {
    return axios.delete(`${this.api}/User/${userId}/${role}`);
  }

  getNotificationById(notificationId: string) {
    return axios.get(`${this.api}/Notification/${notificationId}`)
  }

  getAllNotifications() {
    return axios.get(`${this.api}/Notification`)
  }
}

export default new AdminService();
