import styles from './style.module.scss'

export const Loader = ({ size = 25 }: { size?: number }) => {
  return (
    <div style={{ width: size, height: size }} className={styles.spinner} />
  );
};
