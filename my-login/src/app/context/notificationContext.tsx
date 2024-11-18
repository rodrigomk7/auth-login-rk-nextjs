"use client";

import { Notification } from "../componets/notification";
import { StatusNotification } from "../interfaces";
import { createContext, useState } from "react";

interface IState {
  open: Boolean;
  status: StatusNotification;
  msj: string | null;
}

interface INotificacion extends IState {
  showNotification: (props: IState) => void;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const defaultState: IState = {
  open: false,
  status: null,
  msj: null,
};

export const NotificationContext = createContext<INotificacion>(
  {} as INotificacion
);

export const NotificationProvider: React.FC<Props> = ({ children }) => {
  const [notificacion, setNotification] = useState<IState>(defaultState);

  const showNotification = (props: IState) => {
    if (props) {
      setNotification(props);
      setTimeout(
        () => setNotification({ open: false, status: null, msj: null }),
        3000
      );
    }
  };
  return (
    <NotificationContext.Provider value={{ ...notificacion, showNotification }}>
      {children}
      {notificacion.open && (
        <>
          <Notification status={notificacion.status} msj={notificacion.msj} />
        </>
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
