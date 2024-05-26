import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import styles from './Chat.module.scss';

const Chat = ({ patient }) => {
   const isAuth = useSelector(selectIsAuth);
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState('');
   const [receiverId, setReceiverId] = useState('');

   // Используем patient._id как senderId
   const senderId = patient?._id;

   useEffect(() => {
      if (isAuth) {
         axios
            .get('http://localhost:4444/messages', {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
               },
            })
            .then((res) => {
               setMessages(res.data.messages || []); // Проверка наличия messages
            })
            .catch((error) => {
               console.error('Ошибка при получении сообщений', error);
               setMessages([]); // В случае ошибки устанавливаем пустой массив
            });
      }
   }, [isAuth]);

   console.log(patient?.messages);

   const handleSendMessage = async () => {
      try {
         const response = await axios.post(
            'http://localhost:4444/messages',
            {
               receiverId,
               message: newMessage,
               senderId,
            },
            {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
               },
            },
         );
         setMessages((prev) => [...prev, response.data]);
         setNewMessage('');
      } catch (error) {
         console.error('Ошибка при отправке сообщения', error);
      }
   };

   return (
      <div className={styles.chat}>
         <div className={styles.messageList}>
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
         </div>
      </div>
   );
};

export default Chat;
