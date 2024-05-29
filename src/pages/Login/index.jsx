import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';

import styles from './Login.module.scss';
import { fetchUserData, selectIsAuth } from '../../redux/slices/auth';

export const Login = () => {
   const isAuth = useSelector(selectIsAuth);
   const dispatch = useDispatch();
   const [userType, setUserType] = useState('patient'); // State для хранения выбранного типа пользователя

   const {
      register,
      handleSubmit,
      formState: { errors, isValid },
   } = useForm({
      defaultValues: {
         email: '1111test@test.ru',
         password: '12345',
      },
      mode: 'onChange',
   });

   const onSubmit = async (values) => {
      const data = await dispatch(fetchUserData({ ...values, userType })); // Передаем выбранный тип пользователя вместе с данными

      if (!data.payload) {
         return alert('Не удалось авторизоваться');
      }

      if ('token' in data.payload) {
         window.localStorage.setItem('token', data.payload.token);
      }
   };

   if (isAuth) {
      return <Navigate to="/" />;
   }

   return (
      <Paper classes={{ root: styles.root }}>
         <Typography classes={{ root: styles.title }} variant="h5">
            Вход в аккаунт
         </Typography>
         <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
               className={styles.field}
               label="E-Mail"
               error={Boolean(errors.email?.message)}
               helperText={errors.email?.message}
               type="email"
               {...register('email', { required: 'Укажите почту' })}
               fullWidth
            />
            <TextField
               className={styles.field}
               label="Пароль"
               error={Boolean(errors.password?.message)}
               helperText={errors.password?.message}
               {...register('password', { required: 'Укажите пароль' })}
               fullWidth
            />
            <Button
               style={{ color: '#ffffff', backgroundColor: '#3f51b5' }}
               disabled={!isValid}
               type="submit"
               size="large"
               variant="contained"
               fullWidth>
               Войти
            </Button>
         </form>
      </Paper>
   );
};
