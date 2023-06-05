import React, { useEffect } from "react";
import UserDTO from "../models/api/userDTO";

export interface UserProps {
  logged: boolean;
  data?: UserDTO;
  isPremium: boolean;
  boughtEbooksIds: string[];
  numberOfAddedEbooks: number
}

export interface UserContextType {
  user: UserProps;
  setLogged: (logged: boolean) => void;
  setUser: (user: UserDTO) => void;
  containsEbookId: (ebookId: string) => boolean;
  setNumberOfAddedEbooks: (value: number) => void;
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
        isPremium: false,
        boughtEbooksIds: [],
        numberOfAddedEbooks: 0
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user))
  }, [user])

  const setLogged = (logged: boolean) => {
    if(!logged){
      setUser({logged: logged, isPremium: false, boughtEbooksIds: [], numberOfAddedEbooks: 0 });
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

  const containsEbookId = (ebookId: string) => {
    if(!user.boughtEbooksIds){
      return false;
    }
    return user.boughtEbooksIds.includes(ebookId)
  }

  const setNumberOfAddedEbooks = (value: number) => {
    setUser({...user, numberOfAddedEbooks: value})
  }

  return (
    <UserContext.Provider value={{ user, setLogged,  setUser: setNewUser, setAll, containsEbookId, setNumberOfAddedEbooks}}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
