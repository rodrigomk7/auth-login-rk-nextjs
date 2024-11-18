import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import { messages } from "../utils/messages";
import { useContext } from "react";
import NotificationContext from "../context/notificationContext";

interface AuthFetchProps {
  endpoint: string;
  redirectRoute: string;
  formData: any;
  opcions?: AxiosRequestConfig<any>;
}

export function useAuthFetch() {
  const { showNotification } = useContext(NotificationContext);

  const router = useRouter();

  const authRouter = async ({
    endpoint,
    redirectRoute,
    formData,
    opcions,
  }: AuthFetchProps) => {
    try {
      const { data } = await axios.post(
        `/api/auth/${endpoint}`,
        formData,
        opcions
      );
      console.log(formData);

      /*mostarar una notificacion */
      showNotification({
        msj: data.message,
        open: true,
        status: 'success'
      })

      /*creo el contexto */
      if (redirectRoute) router.push(redirectRoute);

      /** */
    } catch (error: any) {
      

        showNotification({
            msj: error.response.data.message,
            open: true,
            status: 'success'
          })

      //NextResponse.json({ message: messages.error.default }, { status: 400 });
    }
  };

  return authRouter;
}
