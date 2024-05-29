import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuth } from '../../redux/slices/auth'
import styles from './Chat.module.scss'
import { ChatItem } from './components/ChatItem/ChatItem'
import { ChatMessages } from './components/ChatMessages/ChatMessages'
import instance, { baseURL } from '../../axios'

const Chat = ({ patient }) => {
  const [users, setUsers] = useState([])
  const [selectedReceiverId, setSelectedReceiverId] = useState(null)

  const isAuth = useSelector(selectIsAuth)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [receiverId, setReceiverId] = useState('')

  const userData = useSelector((state) => state.auth?.data)

  const isPatient = useSelector((state) => state.auth?.data?.patient)

  const doctors = useMemo(() => users.filter((user) => !user.patient), [users])
  const patients = useMemo(() => users.filter((user) => user.patient), [users])
  const chatUsersList = isPatient ? doctors : patients

  // console.log(doctors, patients)

  const senderId = patient?._id

  useEffect(() => {
    if (isAuth) {
      instance
        .get(`${baseURL}/messages`, {
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

  const handleSendMessage = async () => {
    try {
      const response = await instance.post(
        `${baseURL}/messages`,
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

  useEffect(() => {
    const getAllUsers = async () => {
      const { data } = await instance.get('/user/list')
      console.log(data)
      setUsers(data)
    }
    getAllUsers()
  }, [])

  useEffect(() => {
    if (!selectedReceiverId && !!chatUsersList.length) {
      setSelectedReceiverId(chatUsersList[0]._id)
    }
  }, [chatUsersList, selectedReceiverId])

  useEffect(() => {
    // send()
  }, [])

  const send = async () => {
    instance.post('/messages', {
      receiverId: '66073e6a4bdad1c07f03b069',
      message: 'Hellloooooo',
      senderId: userData._id
    })
  }

  const receiverUser = chatUsersList.find(
    (user) => user._id === selectedReceiverId
  )
  // const selectedActiveChatMessages = userData

  // console.log(userData)

  return (
    <div className={styles.container}>
      <div className={styles.chatsList}>
        {chatUsersList.map((user) => (
          <ChatItem
            key={user._id}
            isSelected={user._id === selectedReceiverId}
            name={user.fullName}
            setSelectedChatId={() => setSelectedReceiverId(user._id)}
          />
        ))}
      </div>
      <div className={styles.chatMessages}>
        <div className={styles.topActiveChatInfo}>
          <img
            src="https://www.gravatar.com/avatar/1dbf9af588c269f188dc5be2b0a038ed.jpg?size=240&d=https%3A%2F%2Fwww.artstation.com%2Fassets%2Fdefault_avatar.jpg"
            className={styles.activeChatImg}
            alt=""
          />
          <p className={styles.userName}>{receiverUser?.fullName}</p>
        </div>
        <ChatMessages
          selectedReceiverId={selectedReceiverId}
          receiverName={receiverUser?.fullName}
        />
      </div>
    </div>
  )
}

export default Chat

/* 

- Doctor:

chats: {
  Patient1Id: [],
  PAtient2Id: []
}


- Patient: 

chats: {
  doctor1Id: []
  doctor2Id: []
}


*/
