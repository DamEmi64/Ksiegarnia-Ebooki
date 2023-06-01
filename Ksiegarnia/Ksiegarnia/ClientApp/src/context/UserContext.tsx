import React, { useEffect } from "react";
import UserDTO from "../models/api/userDTO";

export interface UserProps {
  logged: boolean;
  data?: UserDTO;
  isPremium: boolean;
}

export interface UserContextType {
  user: UserProps;
  setLogged: (logged: boolean) => void;
  setUser: (user: UserDTO) => void;
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
    } 
    else {
      return {
        logged: false,
        isPremium: false
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user))
  }, [user])

  const setLogged = (logged: boolean) => {
    if(!logged){
      setUser({logged: logged, isPremium: false });
    }
    else{
      setUser({...user, logged: logged})
    }
  };

  const setNewUser = (newUser: UserDTO) => {
    setUser({...user, data: newUser})
  }

  const setAll = (newData: UserProps) => {
    setUser(newData)
  }

  return (
    <UserContext.Provider value={{ user, setLogged,  setUser: setNewUser, setAll}}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
