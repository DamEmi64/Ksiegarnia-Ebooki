﻿import axios from "axios";
import HideInfo from "../models/api/hideInfo";

export interface RegisterProps {
  firstName?: string;
  lastName?: string;
  email: string;
  birthDate: string;
  phoneNumber?: string;
  password: string;
  nick: string;
}

export interface UpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  nick?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface GetOwnedEbooksProps {
  userId: string;
  authorId?: string;
  phrase?: string;
  page?: number;
  pageSize?: number;
}

export interface GetPublishedEbooksProps {
  userId: string;
  authorId?: string;
  phrase?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

class UserService {
  private api = `${process.env.REACT_APP_API}/Users`;

  getById(userId: string) {
    return axios.get(`${this.api}/${userId}`);
  }

  search(phrase: string) {
    return axios.get(`${this.api}/search`, {
      params: {
        phrase,
      },
    });
  }

  getLoggedUser() {
    return axios.get(this.api);
  }

  getUserNumberOfDistinctions() {
    return axios.get(`${this.api}/Distinction`);
  }

  register(request: RegisterProps) {
    const hideInfo: HideInfo = {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      age: true,
    };

    return axios.post(`${this.api}/Register`, {
      ...request,
      hideInfo: hideInfo,
    });
  }

  login(credentials: Credentials) {
    return axios.post(`${this.api}/Login`, credentials);
  }

  logout() {
    return axios.post(`${this.api}/logout`);
  }

  update(userId: string, request: UpdateRequest) {
    const hideInfo: HideInfo = {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      age: true,
    };

    return axios.put(`${this.api}/${userId}`, {
      ...request,
      hideInfo: hideInfo,
    });
  }

  getPasswordResetToken(email: string) {
    return axios.get(`${this.api}/${email}/passwordResetToken`);
  }

  resetPassword(resetToken: string, email: string, newPassword: string) {
    return axios.post(`${this.api}/${email}/passwordReset`, newPassword, {
      params: {
        token: resetToken,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  updatePassword(userId: string, oldPassword: string, newPassword: string) {
    return axios.post(`${this.api}/${userId}/passwordChange`, {
      oldPassword: oldPassword,
      password: newPassword,
    });
  }

  getEmailUpdateToken(userId: string, newEmail: string) {
    return axios.get(`${this.api}/${userId}/emailToken`, {
      params: {
        newEmail: newEmail,
      },
    });
  }

  updateEmail(userId: string, token: string, newEmail: string) {
    return axios.post(
      `${this.api}/${userId}/emailChange`,
      {},
      {
        params: {
          token: token,
          newEmail: newEmail,
        },
      }
    );
  }

  confirmEmail(userId: string, token: string) {
    return axios.get(`${this.api}/ConfirmEmail`, {
      params: {
        id: userId,
        token: token
      }
    })
  }

  getOwnedEbooks(props: GetOwnedEbooksProps) {
    return axios.get(`${this.api}/${props.userId}/ebooks`, {
      params: {
        title: props.phrase ? props.phrase : null,
        page: props.page,
        pageSize: props.pageSize,
      },
    });
  }

  getPublishedEbooks(props: GetPublishedEbooksProps) {
    return axios.get(`${this.api}/${props.userId}/publications`, {
      params: {
        author: props.authorId ? props.authorId : null,
        title: props.phrase ? props.phrase : null,
        sort: props.sort,
        page: props.page,
        pageSize: props.pageSize,
      },
    });
  }
}

export default new UserService();
