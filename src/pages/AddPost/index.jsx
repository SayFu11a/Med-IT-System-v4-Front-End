import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from '../../redux/slices/auth';
import axios, { baseURL } from '../../axios';
import styles from './AddPost.module.scss';

export const AddPost = ({ isPatient, patient }) => {
   const { id } = useParams();
   const navigate = useNavigate();
   const isAuth = useSelector(selectIsAuth);
   const [isLoading, setLoading] = React.useState(false);
   const [text, setText] = React.useState('');
   const [title, setTitle] = React.useState('');
   const [tags, setTags] = React.useState('');
   const [imageUrl, setImageUrl] = React.useState('');
   const [documentUrl, setDocumentUrl] = React.useState('');
   const inputFileRef = React.useRef(null);

   const isEditing = Boolean(id);

   const handleChangeFile = async (event) => {
      try {
         const formData = new FormData();
         const file = event.target.files[0];
         formData.append('image', file);
         const { data } = await axios.post('/upload', formData);
         setImageUrl(data.url);
      } catch (err) {
         console.warn(err);
         alert('ошибка при загрузке файла');
      }
   };

   const handleDocumentUpload = async (event) => {
      try {
         const formData = new FormData();
         const file = event.target.files[0];
         formData.append('document', file);
         const { data } = await axios.post('/uploadDocument', formData);
         setDocumentUrl(data.url);
      } catch (err) {
         console.warn(err);
         alert('ошибка при загрузке документа');
      }
   };

   const onClickRemoveImage = () => {
      setImageUrl('');
   };

   const onChange = React.useCallback((value) => {
      setText(value);
   }, []);

   const onSubmit = async () => {
      try {
         setLoading(true);

         const fields = {
            title,
            imageUrl,
            documentUrl,
            tags,
            text,
         };

         const { data } = isEditing
            ? await axios.patch(`/posts/${id}`, fields)
            : await axios.post('/posts', fields);

         const _id = isEditing ? id : data._id;

         navigate(`/posts/${_id}`);
      } catch (err) {
         console.warn(err);
         alert('ошибка при создании статьи!');
      }
   };

   React.useEffect(() => {
      if (id) {
         axios
            .get(`/posts/${id}`)
            .then(({ data }) => {
               setTitle(data.title);
               setText(data.text);
               setImageUrl(data.imageUrl);
               setDocumentUrl(data.documentUrl);
               setTags(data.tags.join(','));
            })
            .catch((err) => {
               console.warn(err);
               alert('ошибка при получении статьи!');
            });
      }
   }, []);

   const options = React.useMemo(
      () => ({
         spellChecker: false,
         maxHeight: '400px',
         autofocus: true,
         placeholder: 'Введите текст...',
         status: false,
         autosave: {
            enabled: true,
            delay: 1000,
         },
      }),
      [],
   );

   if (!window.localStorage.getItem('token') && !isAuth) {
      return <Navigate to="/" />;
   }

   return (
      <>
         {!isPatient && (
            <Paper style={{ padding: 30 }}>
               <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
                  Загрузить превью
               </Button>
               <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
               {imageUrl && (
                  <>
                     <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                        Удалить
                     </Button>
                     <img className={styles.image} src={`${baseURL}${imageUrl}`} alt="Uploaded" />
                  </>
               )}

               <br />
               <br />
               <TextField
                  classes={{ root: styles.title }}
                  variant="standard"
                  placeholder="Имя пациента..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
               />
               <TextField
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  classes={{ root: styles.tags }}
                  variant="standard"
                  placeholder="Болезнь"
                  fullWidth
               />
               <SimpleMDE
                  className={styles.editor}
                  value={text}
                  onChange={onChange}
                  options={options}
               />
               <div>
                  <input type="file" onChange={handleDocumentUpload} />
               </div>
               <div className={styles.buttons}>
                  <Button
                     style={{ color: '#ffffff', backgroundColor: '#3f51b5' }}
                     onClick={onSubmit}
                     size="large"
                     variant="contained">
                     {isEditing ? 'Редактировать' : 'Опубликовать'}
                  </Button>
                  <a href="/">
                     <Button size="large">Отмена</Button>
                  </a>
               </div>
            </Paper>
         )}
         <>
            {isPatient && (
               <Paper style={{ padding: 30 }}>
                  <div>
                     <input type="file" onChange={handleDocumentUpload} />
                  </div>
                  <div className={styles.buttons}>
                     <Button onClick={onSubmit} size="large" variant="contained">
                        {isEditing ? 'Редактировать' : 'Опубликовать'}
                     </Button>
                     <a href="/">
                        <Button size="large">Отмена</Button>
                     </a>
                  </div>
               </Paper>
            )}
         </>
      </>
   );
};
