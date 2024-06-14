import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import instance from '../../axios';
import styles from './PatientHealth.module.scss';

export const PatientHealth = () => {
   const [users, setUsers] = useState([]);
   const [selectedPatient, setSelectedPatient] = useState(null);

   const userData = useSelector((state) => state.auth?.data);
   const isPatient = useSelector((state) => state.auth?.data?.patient);

   const doctors = useMemo(() => users.filter((user) => !user.patient), [users]);
   const patients = useMemo(() => users.filter((user) => user.patient), [users]);
   const chatUsersList = isPatient ? doctors : patients;

   useEffect(() => {
      const getAllUsers = async () => {
         if (userData) {
            const { data } = await instance.get('/user/list');
            setUsers(data.filter((user) => user._id !== userData?._id));
         }
      };
      getAllUsers();
   }, [userData]);

   const handlePatientClick = (patient) => {
      setSelectedPatient(patient);
   };

   const filterSymptoms = (symptoms) => {
      return Object.entries(symptoms)
         .filter(([key, value]) => value === true)
         .map(([key]) => key);
   };

   return (
      <div className={styles.container}>
         <h2 className={styles.heading}>Список пациентов</h2>
         <ul className={styles.patientList}>
            {patients.map((patient) => (
               <li
                  key={patient._id}
                  className={styles.patientItem}
                  onClick={() => handlePatientClick(patient)}>
                  <div className={styles.patientInfo}>
                     <div>
                        <strong>Имя:</strong> {patient.fullName}
                     </div>
                     <div>
                        <strong>Email:</strong> {patient.email}
                     </div>
                     <div>
                        <strong>Дата создания:</strong>{' '}
                        {new Date(patient.createdAt).toLocaleDateString()}
                     </div>
                  </div>
               </li>
            ))}
         </ul>
         {selectedPatient && (
            <div>
               <h3 className={styles.heading}>
                  Записи о состоянии здоровья: {selectedPatient.fullName}
               </h3>
               <ul className={styles.healthRecords}>
                  {selectedPatient.healthRecords.map((record, index) => (
                     <li key={index} className={styles.recordItem}>
                        <div className={styles.recordInfo}>
                           <div>Дата: {new Date(record.date).toLocaleDateString()}</div>
                           <div className={styles.recordSymptoms}>
                              Симптомы: {filterSymptoms(record.symptoms).join(', ')}
                           </div>
                        </div>
                     </li>
                  ))}
               </ul>
            </div>
         )}
      </div>
   );
};

export default PatientHealth;
