import React, { useEffect } from "react";

export interface UserProps {
  logged: boolean;
}

export interface UserContextType {
  user: UserProps;
  setLogged: (logged: boolean) => void;
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
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user))
  }, [user])

  const setLogged = (logged: boolean) => {
    setUser({ logged: logged });
  };

  return (
    <UserContext.Provider value={{ user, setLogged }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
