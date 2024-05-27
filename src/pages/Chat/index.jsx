import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectIsAuth } from '../../redux/slices/auth'
import styles from './Chat.module.scss'
import { ChatItem } from './components/ChatItem/ChatItem'
import { ChatMessages } from './components/ChatMessages/ChatMessages'

const Chat = ({ patient }) => {
  const isAuth = useSelector(selectIsAuth)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [receiverId, setReceiverId] = useState('')

  // Используем patient._id как senderId
  const senderId = patient?._id

  useEffect(() => {
    if (isAuth) {
      axios
        .get('http://localhost:4444/messages', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((res) => {
          setMessages(res.data.messages || []) // Проверка наличия messages
        })
        .catch((error) => {
          console.error('Ошибка при получении сообщений', error)
          setMessages([]) // В случае ошибки устанавливаем пустой массив
        })
    }
  }, [isAuth])

  console.log(patient?.messages)

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4444/messages',
        {
          receiverId,
          message: newMessage,
          senderId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setMessages((prev) => [...prev, response.data])
      setNewMessage('')
    } catch (error) {
      console.error('Ошибка при отправке сообщения', error)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatsList}>
        <ChatItem
          name="Максим Гаврилов"
          lastMessage="Добрый день! Спасибо, приду без опозданий!          "
        />
        <ChatItem
          name="Юрий Прикладов"
          lastMessage="Здравствуйте, а когда приходить на консультацию?"
        />
        <ChatItem name="Анастасия Сколкова" lastMessage="Поняла вас, спасибо большое!" />
        <ChatItem name="Андрей Белкин" lastMessage="Хорошо, приду через 2 недели" />
      </div>
      <div className={styles.chatMessages}>
        <div className={styles.topActiveChatInfo}>
          <img
            src="https://www.gravatar.com/avatar/1dbf9af588c269f188dc5be2b0a038ed.jpg?size=240&d=https%3A%2F%2Fwww.artstation.com%2Fassets%2Fdefault_avatar.jpg"
            className={styles.activeChatImg}
            alt=""
          />
          <p className={styles.userName}>Максим Гаврилов</p>
        </div>
        <ChatMessages />
      </div>

      {/* <div className={styles.messageList}>
        {patient?.messages?.length > 0 ? (
          patient.messages.map((msg, index) => (
            <div key={index} className={styles.message}>
              <strong>{msg.senderId}</strong>: {msg.message}
            </div>
          ))
        ) : (
          <div className={styles.noMessages}>Нет сообщений</div>
        )}
      </div>
      <div className={styles.sendMessageForm}>
        <input
          type="text"
          placeholder="ID получателя"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Введите сообщение"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Отправить</button>
      </div> */}
    </div>
  )
}

export default Chat
