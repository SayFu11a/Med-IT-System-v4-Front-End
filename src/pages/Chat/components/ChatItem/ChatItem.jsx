import styles from './ChatItem.module.scss'

export const ChatItem = ({ name, lastMessage }) => {
  return (
    <div className={styles.root}>
      <img
        src="https://www.gravatar.com/avatar/1dbf9af588c269f188dc5be2b0a038ed.jpg?size=240&d=https%3A%2F%2Fwww.artstation.com%2Fassets%2Fdefault_avatar.jpg"
        alt=""
        className={styles.avatarImg}
      />

      <div className={styles.userInfo}>
        <p className={styles.userName}>{name}</p>
        <p className={styles.lastMessage}>Пациент: {lastMessage}</p>
      </div>
    </div>
  )
}
