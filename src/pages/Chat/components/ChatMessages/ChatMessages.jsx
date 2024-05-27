import styles from './ChatMessages.module.scss'

export const ChatMessages = () => {
  return (
    <div className={styles.root}>
      <p className={styles.timeLabel}>Сегодня</p>

      <div className={styles.doctorMessage}>
        <p className={styles.messageTime}>11:44</p>
        <p className={styles.messageText}>
          Здравствуйте, Максим! Записали вас на пятницу, время записи 14:30!
        </p>
      </div>

      <div className={styles.patientMessage}>
        <img
          className={styles.patientImg}
          src="https://www.gravatar.com/avatar/1dbf9af588c269f188dc5be2b0a038ed.jpg?size=240&d=https%3A%2F%2Fwww.artstation.com%2Fassets%2Fdefault_avatar.jpg"
          alt=""
        />
        <div className={styles.textBlock}>
          <div className={styles.topInfo}>
            <p className={styles.patientName}>Максим Гаврилов</p>
            <p className={styles.patientMessageTime}>11:58</p>
          </div>
          <p className={styles.messageText}>
            Добрый день! Спасибо, приду без опозданий!
          </p>
        </div>
      </div>

      <div className={styles.inputContainer}>
        <input
          className={styles.userInput}
          type="text"
          placeholder="Введите ваше сообщение"
        />
        <button>Отправить</button>
      </div>
    </div>
  )
}
