import { useSelector } from 'react-redux'
import styles from './ChatMessages.module.scss'
import { useEffect, useState } from 'react'
import { useMemo } from 'react'
import instance from '../../../../axios'

export const ChatMessages = ({ selectedReceiverId, receiverName }) => {
  const userData = useSelector((state) => state.auth?.data)
  const selectedActiveChatMessages = useMemo(
    () => userData?.chats[selectedReceiverId] || [],
    [selectedReceiverId, userData?.chats]
  )

  const [inputData, setInputData] = useState('')
  const [chatMessages, setChatMessages] = useState(selectedActiveChatMessages)

  useEffect(() => {
    setChatMessages(selectedActiveChatMessages)
  }, [selectedActiveChatMessages])

  const handleSendMessage = async () => {
    if (!inputData) return

    setChatMessages((prev) => [
      ...prev,
      {
        senderId: userData._id,
        receiverId: selectedReceiverId,
        message: inputData,
        timestamp: new Date()
      }
    ])

    setInputData('')
    await instance.post('/messages', {
      receiverId: selectedReceiverId,
      message: inputData,
      senderId: userData._id
    })
  }

  console.log(chatMessages)

  return (
    <div className={styles.root}>
      <div className={styles.messagesList}>

      {chatMessages.map((message) => {
        const isMine = message.senderId === userData._id
        const [messageHours, messageMinutes] = new Date(message.timestamp)
          .toLocaleTimeString()
          .split(':')

        return userData.patient ? (
          
          <div
            className={styles.patientMessage}
            style={{ alignSelf: isMine ? 'flex-end' : 'flex-start' }}
          >
            <p className={styles.messageTime}>
              {`${messageHours}:${messageMinutes}`}
            </p>
            <p className={styles.messageText}>{message.message}</p>
          </div>
        ) : (
          <div
            className={styles.doctorMessage}
            style={{ alignSelf: isMine ? 'flex-end' : 'flex-start' }}
          >
            <p className={styles.messageTime}>
              {`${messageHours}:${messageMinutes}`}
            </p>
            <p className={styles.messageText}>{message.message}</p>
          </div>
        )
      })}
      </div>


      <div className={styles.inputContainer}>
        <input
          onChange={(e) => setInputData(e.target.value)}
          value={inputData}
          className={styles.userInput}
          type="text"
          placeholder="Введите ваше сообщение"
        />
        <button onClick={handleSendMessage}>Отправить</button>
      </div>
    </div>
  )
}
