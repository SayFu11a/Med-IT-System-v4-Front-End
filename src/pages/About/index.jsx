import React, { useState } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './About.module.scss';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { Link } from 'react-router-dom';

export const About = () => {
   const [tabValue, setTabValue] = useState(1);

   const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
   };

   return (
      <Container>
         <Tabs
            onChange={handleTabChange}
            style={{ marginBottom: 15 }}
            value={tabValue}
            aria-label="basic tabs example">
            <Link style={{ textDecoration: 'none' }} to="/">
               <Tab label="Главная" style={{ color: '#ffffff', backgroundColor: '#3f51b5' }} />
            </Link>
            <Tab label="О нас" style={{ color: '#ffffff', backgroundColor: '#3f51b5' }} />
         </Tabs>
         <Paper elevation={3} className={styles.paper}>
            <Typography variant="h4" component="h1" gutterBottom>
               Добро пожаловать в веб-приложение "Дневник пациента"
            </Typography>
            <Typography variant="body1" gutterBottom>
               Добро пожаловать в веб-приложение "Дневник пациента" – инновационное решение для
               управления медицинскими записями и обеспечения качественного взаимодействия между
               врачами и пациентами. Наша миссия – сделать процесс ведения истории болезни,
               корректировки лечения и обратной связи удобным, безопасным и доступным для всех
               участников медицинского процесса.
            </Typography>

            <Typography variant="h5" component="h2" gutterBottom>
               На данный момент для врачей доступно:
            </Typography>
            <Box component="ul" className={styles.list}>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Авторизация.
               </li>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Добавление новых пациентов, а также их
                  удаление.
               </li>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Просмотр и редактирование историй
                  болезней ваших пациентов в удобном формате.
               </li>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Доступ к медицинской информации в
                  любое время и из любого места.
               </li>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Возможность добавления и обновления
                  записей, назначений, документов, результатов анализов и рекомендаций.
               </li>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Просмотр отмеченных пациентом
                  симптомов.
               </li>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Пользование чатом.
               </li>
            </Box>

            <Typography variant="h5" component="h2" gutterBottom>
               Для пациентов:
            </Typography>
            <Box component="ul" className={styles.list}>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Авторизация.
               </li>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Просмотр личной истории болезни и
                  медицинских записей.
               </li>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Отслеживание динамики своего здоровья
                  и выполнение рекомендаций врача.
               </li>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Добавление собственных фотографии,
                  сканов анализов.
               </li>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Фиксирование своего каждодневного
                  самочувствия.
               </li>
               <li>
                  <CheckCircleIcon className={styles.icon} /> Пользование чатом.
               </li>
            </Box>

            <Typography variant="body1" gutterBottom>
               У пациента, в отличие от врача, есть некоторые ограничения в действиях, но сделано
               это в целях безопасности данных. Если у вас возникли вопросы или проблемы с
               использованием нашего приложения, вы можете обратиться в нашу службу поддержки по
               электронной почте <span style={{ opacity: 0 }}>f</span>{' '}
               <EmailIcon className={styles.icon} />
               <a href="mailto:Dnevnikpatcienta@gmail.com">Dnevnikpatcienta@gmail.com</a>
               или по телефону <span style={{ opacity: 0 }}>f</span>
               <PhoneIcon className={styles.icon} />{' '}
               <a href="tel:+79667205444"> +7 (966) 720-54-44</a>. Мы всегда рады помочь и готовы
               ответить на любые ваши вопросы. Благодарим вас за выбор нашего приложения и надеемся
               на долгое и плодотворное сотрудничество!
            </Typography>
         </Paper>
      </Container>
   );
};
