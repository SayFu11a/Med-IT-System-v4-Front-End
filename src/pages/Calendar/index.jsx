import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import axios from '../../axios';

import styles from './Calendar.module.scss';

const symptoms = [
   'головокружение',
   'рвота',
   'боли в животе',
   'шум в ушах',
   'повышенная утомляемость',
   'бессонница',
   'расстройство памяти',
   'судороги',
   'тремор',
   'тик',
   'онемение',
   'покалывание в конечностях',
   'боль в голове и других участках тела',
   'потеря сознания',
   'нарушение координации движений и равновесия',
   'нарушение речи',
   'резкое ухудшение зрения',
];

function Calendar() {
   const [selectedDate, setSelectedDate] = useState(new Date());
   const [symptomChecks, setSymptomChecks] = useState(
      symptoms.reduce((acc, symptom) => {
         acc[symptom] = false;
         return acc;
      }, {}),
   );

   const handleSymptomChange = (symptom) => {
      setSymptomChecks((prev) => ({
         ...prev,
         [symptom]: !prev[symptom],
      }));
   };

   const handleSubmit = async () => {
      try {
         const response = await axios.post('http://localhost:4444/health/addRecord', {
            date: selectedDate,
            symptoms: symptomChecks,
         });
         alert('Данные успешно сохранены!');
      } catch (error) {
         console.error('Ошибка при сохранении данных:', error);
         alert('Ошибка при сохранении данных');
      }
   };

   // Функция для добавления записи о самочувствии
   const addHealthRecord = async (date, symptoms) => {
      const response = await fetch('/api/healthRecords', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`, // предполагается, что токен хранится в состоянии или localStorage
         },
         body: JSON.stringify({ date, symptoms }),
      });
      const data = await response.json();
      return data;
   };

   // Функция для получения всех записей о самочувствии
   const fetchHealthRecords = async () => {
      const response = await fetch('/api/healthRecords', {
         method: 'GET',
         // headers: {
         //    Authorization: `Bearer ${token}`,
         // },
      });
      const data = await response.json();
      return data;
   };

   return (
      <>
         <h2>Динамика текущего состояния</h2>
         <div style={{ display: 'flex' }}>
            <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} inline />
            <div className={styles.symptomsContainer}>
               {symptoms.map((symptom) => (
                  <div key={symptom} className={styles.symptomItem}>
                     <input
                        type="checkbox"
                        id={symptom}
                        name={symptom}
                        checked={symptomChecks[symptom]}
                        onChange={() => handleSymptomChange(symptom)}
                     />
                     <label htmlFor={symptom}>{symptom}</label>
                  </div>
               ))}
            </div>
         </div>
         <button onClick={handleSubmit} style={{ marginTop: '20px' }}>
            Сохранить состояние
         </button>
      </>
   );
}

export default Calendar;
