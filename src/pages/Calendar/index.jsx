import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from 'date-fns/locale/ru';
import axios, { baseURL } from '../../axios';
import styles from './Calendar.module.scss';

// Регистрация локали
registerLocale('ru', ru);

const symptoms = [
   'Головокружение',
   'Рвота',
   'Боли в животе',
   'Шум в ушах',
   'Повышенная утомляемость',
   'Бессонница',
   'Расстройство памяти',
   'Судороги',
   'Тремор',
   'Тик',
   'Онемение',
   'Покалывание в конечностях',
   'Боль в голове и других участках тела',
   'Потеря сознания',
   'Нарушение координации движений и равновесия',
   'Нарушение речи',
   'Резкое ухудшение зрения',
];

function Calendar({ isPatient, patient }) {
   const [selectedDate, setSelectedDate] = useState(new Date());
   const [symptomChecks, setSymptomChecks] = useState(
      symptoms.reduce((acc, symptom) => {
         acc[symptom] = false;
         return acc;
      }, {}),
   );

   useEffect(() => {
      const symptomsForDate = getSymptomsByDate(patient?.healthRecords, selectedDate);
      if (symptomsForDate) {
         setSymptomChecks(symptomsForDate);
      } else {
         setSymptomChecks(
            symptoms.reduce((acc, symptom) => {
               acc[symptom] = false;
               return acc;
            }, {}),
         );
      }
   }, [selectedDate, patient]);

   const getSymptomsByDate = (healthRecords, date) => {
      // Проверка на существование и тип healthRecords
      if (!Array.isArray(healthRecords)) {
         console.error('healthRecords is not an array or does not exist');
         return null;
      }

      console.log(patient);

      // Форматируем дату для сравнения (без времени)
      const targetDate = new Date(date).toISOString().split('T')[0];

      // Фильтруем записи за выбранную дату
      const recordsForDate = healthRecords.filter((record) => {
         const recordDate = new Date(record.date).toISOString().split('T')[0];
         return recordDate === targetDate;
      });

      // Если нет записей за эту дату, возвращаем null
      if (recordsForDate.length === 0) {
         return null;
      }

      // Находим запись с самым поздним временем
      const latestRecord = recordsForDate.reduce((latest, current) => {
         return new Date(latest.date) > new Date(current.date) ? latest : current;
      });

      return latestRecord.symptoms;
   };

   const handleSymptomChange = (symptom) => {
      setSymptomChecks((prev) => ({
         ...prev,
         [symptom]: !prev[symptom],
      }));
   };

   const handleSubmit = async () => {
      try {
         const response = await axios.post(`${baseURL}/health/addRecord`, {
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
            <DatePicker
               selected={selectedDate}
               onChange={(date) => setSelectedDate(date)}
               inline
               locale="ru" // Установка локали на русский язык
            />
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
         <button className={styles.submitBtn} onClick={handleSubmit} style={{ marginTop: '20px' }}>
            Сохранить состояние
         </button>
      </>
   );
}

export default Calendar;
