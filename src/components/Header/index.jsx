import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { logout, selectIsAuth } from '../../redux/slices/auth';

export const Header = ({ isPatient, patient }) => {
   const dispatch = useDispatch();
   const isAuth = useSelector(selectIsAuth);

   const onClickLogout = () => {
      if (window.confirm('Вы уверены что хотите выйти?')) {
         dispatch(logout());
         window.localStorage.removeItem('token');
      }
   };

   return (
      <div className={styles.root}>
         <Container maxWidth="lg">
            <div className={styles.inner}>
               <Link className={styles.logo} to="/">
                  <div>Med-IT-System</div>
               </Link>
               <div className={styles.buttons}>
                  {isAuth ? (
                     <>
                        <Link to="/chat">
                           <Button variant="contained">
                              {' '}
                              <img
                                 src="https://cdn1.iconfinder.com/data/icons/office-322/24/email-message-envelope-letter-1024.png"
                                 alt=""
                                 width="20"
                                 style={{ marginRight: '10px', verticalAlign: 'middle' }}
                              />
                              Сообщения
                           </Button>
                        </Link>
                        <Link to="/calendar">
                           <Button variant="contained">
                              {' '}
                              <img
                                 src="https://cdn3.iconfinder.com/data/icons/teamwork-and-organization/25/list_clipboard_planning-1024.png"
                                 alt=""
                                 width="20"
                                 style={{ marginRight: '10px', verticalAlign: 'middle' }}
                              />
                              Самочувствие
                           </Button>
                        </Link>
                        {!isPatient && (
                           <Link to="/add-post">
                              <Button variant="contained">Добавить Пациента</Button>
                           </Link>
                        )}
                        <Button
                           onClick={onClickLogout}
                           variant="contained"
                           style={{ background: 'white' }}>
                           Выйти
                        </Button>
                     </>
                  ) : (
                     <>
                        <Link to="/login">
                           <Button variant="outlined">Войти</Button>
                        </Link>
                        <Link to="/register">
                           <Button variant="contained">Создать аккаунт</Button>
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </Container>
      </div>
   );
};
