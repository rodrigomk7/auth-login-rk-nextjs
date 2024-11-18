import { StatusNotification } from '@/app/interfaces'
import styles from './style.module.scss'

interface Props{
  status: StatusNotification
  msj: string | null
}

export const Notification = ( {status, msj}: Props) => {
  return(
    <div className={`${styles.notificacion} ${styles[status!]}`}>
      <p>{msj}</p>
    </div>
  )
}
