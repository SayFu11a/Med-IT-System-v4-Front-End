import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import styles from './Chat.module.scss'
import { ChatItem } from './components/ChatItem/ChatItem'
import { ChatMessages } from './components/ChatMessages/ChatMessages'
import instance from '../../axios'

const Chat = ({ patient }) => {
  const [users, setUsers] = useState([])
  const [selectedReceiverId, setSelectedReceiverId] = useState(null)

  const userData = useSelector((state) => state.auth?.data)
  const isPatient = useSelector((state) => state.auth?.data?.patient)

  const doctors = useMemo(() => users.filter((user) => !user.patient), [users])
  const patients = useMemo(() => users.filter((user) => user.patient), [users])
  const chatUsersList = isPatient ? doctors : patients

  useEffect(() => {
    const getAllUsers = async () => {
      if (userData) {
        const { data } = await instance.get('/user/list')
        setUsers(data.filter((user) => user._id !== userData?._id))
      }
    }
    getAllUsers()
  }, [userData])

  console.log(users, selectedReceiverId)

  useEffect(() => {
    if (!selectedReceiverId && !!chatUsersList.length) {
      setSelectedReceiverId(chatUsersList[0]._id)
    }
  }, [chatUsersList, selectedReceiverId, userData])

  const receiverUser = chatUsersList.find(
    (user) => user._id === selectedReceiverId
  )

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
