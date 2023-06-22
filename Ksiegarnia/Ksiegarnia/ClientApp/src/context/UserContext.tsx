import React, { useEffect } from "react";
import UserDTO from "../models/api/userDTO";
import { Role } from "../models/api/role";
import UserService from "../services/UserService";

export interface UserProps {
  logged: boolean;
  data?: UserDTO;
  isPremium: boolean;
  boughtEbooksIds: string[];
  numberOfAddedEbooks: number;
  numberOfDistinctions: number;
}

export interface UserContextType {
  user: UserProps;
  setLogged: (logged: boolean) => void;
  setUser: (user: UserDTO) => void;
  containsEbookId: (ebookId: string) => boolean;
  containsRole: (role: Role) => boolean;
  setNumberOfAddedEbooks: (value: number) => void;
  setBoughtEbooksIds: (boughtEbooksIds: string[]) => void;
  setNumberOfDistinctions: (value: number) => void;
  setIsPremium: (newIsPremium: boolean) => void;
  setWallet: (newWallet: number) => void;
  setAll: (newData: UserProps) => void;
}

export const UserContext: React.Context<UserContextType | undefined> =
  React.createContext<UserContextType | undefined>(undefined);

const UserProvider = (props: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserProps>(() => {
    const savedUserStr = localStorage.getItem("user");

    if (savedUserStr) {
      const savedUser: UserProps = JSON.parse(savedUserStr);
      return savedUser;
    } else {
      return {
        logged: false,
        isPremium: false,
        boughtEbooksIds: [],
        numberOfAddedEbooks: 0,
        numberOfDistinctions: 0,
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const setLogged = (logged: boolean) => {
    if (!logged) {
      setUser({
        logged: logged,
        isPremium: false,
        boughtEbooksIds: [],
        numberOfAddedEbooks: 0,
        numberOfDistinctions: 0,
      });
    } else {
      setUser({ ...user, logged: logged });
    }
  };

  const setNewUser = (newUser: UserDTO) => {
    setUser({ ...user, data: newUser });
  };

  const setAll = (newData: UserProps) => {
    setUser(newData);
  };

  const containsEbookId = (ebookId: string) => {
    if (!user.boughtEbooksIds) {
      return false;
    }
    return user.boughtEbooksIds.includes(ebookId);
  };

  const setNumberOfAddedEbooks = (value: number) => {
    setUser({ ...user, numberOfAddedEbooks: value });
  };

  const setNumberOfDistinctions = (value: number) => {
    setUser({ ...user, numberOfDistinctions: value });
  };

  const setBoughtEbooksIds = (boughtBooksIds: string[]) => {
    setUser({ ...user, boughtEbooksIds: boughtBooksIds });
  };

  const setIsPremium = (newIsPremium: boolean) => {
    setUser({ ...user, isPremium: newIsPremium });
  };

  const setWallet = (newWallet: number) => {
    setUser({ ...user, data: { ...user.data, wallet: newWallet } as UserDTO });
  };

  const containsRole = (role: Role) => {
    if (!user.data) {
      return false;
    }
    return user.data.roles.includes(role);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setLogged,
        setUser: setNewUser,
        setAll,
        containsEbookId,
        setNumberOfAddedEbooks,
        setBoughtEbooksIds,
        setNumberOfDistinctions,
        setIsPremium,
        setWallet,
        containsRole,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
