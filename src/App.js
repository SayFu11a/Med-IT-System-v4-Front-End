import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@mui/material/Container';

import { Header } from './components';
import { Home, FullPost, Registration, AddPost, Login } from './pages';
import React from 'react';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import Calendar from './pages/Calendar';
import Chat from './pages/Chat';
import { PostDetailsPage } from './pages/PostDetailsPage/PostDetailsPage';
import { About } from './pages/About';
import { PatientHealth } from './pages/PatientHealth';

function App() {
   const dispatch = useDispatch();
   const isAuth = useSelector(selectIsAuth);

   React.useEffect(() => {
      dispatch(fetchAuthMe());
   }, []);

   const patientData = useSelector((state) => {
      if (state.auth && state.auth.data) {
         return state.auth.data.patient;
      }
      return null;
   });

   const patient = useSelector((state) => {
      if (state.auth && state.auth.data) {
         return state.auth.data;
      }
      return null;
   });

   return (
      <>
         <Header isPatient={patientData} patient={patient} />
         <Container maxWidth="lg">
            <Routes>
               <Route
                  path="/"
                  element={
                     patient ? (
                        <Home isPatient={patientData} patient={patient} />
                     ) : (
                        <Navigate to="/login" replace />
                     )
                  }
               />
               <Route
                  path="/posts/:id"
                  element={<PostDetailsPage isPatient={patientData} patient={patient} />}
               />
               <Route
                  path="/posts/:id/edit"
                  element={<AddPost isPatient={patientData} patient={patient} />}
               />
               <Route path="/add-post" element={<AddPost />} />
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Registration />} />
               <Route
                  path="/calendar"
                  element={<Calendar isPatient={patientData} patient={patient} />}
               />
               <Route path="/About" element={<About />} />
               <Route path="/chat" element={<Chat patient={patient} />} />
               <Route path="/patienthealth" element={<PatientHealth />} />
            </Routes>
         </Container>
      </>
   );
}

export default App;
