import React from "react";

export interface NotificationProps {
  isVisible: boolean;
  isSuccessful: boolean;
  message: string;
}

export interface NotificationContextType {
  notification: NotificationProps;
  setIsVisible: (isVisible: boolean) => void;
  setNotification: (notification: NotificationProps) => void;
}

export const NotificationContext: React.Context<NotificationContextType | undefined> =
  React.createContext<NotificationContextType | undefined>(undefined);

const NotificationProvider = (props: { children: React.ReactNode }) => {

  const [notification, setNotification] = React.useState<NotificationProps>({
    isVisible: false,
    isSuccessful: true,
    message: ""
  });

  const setIsVisible = (isVisible: boolean) => {
    setNotification({...notification, isVisible: isVisible})
  };
  return (
    <NotificationContext.Provider value={{ notification, setIsVisible, setNotification }}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
