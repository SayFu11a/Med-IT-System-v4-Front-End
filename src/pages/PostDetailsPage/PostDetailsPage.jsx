import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios, { baseURL } from '../../axios';

import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';

import { useDispatch, useSelector } from 'react-redux';

import { Post } from '../../components/Post';
import { Index } from '../../components/AddComment';
import { CommentsBlock } from '../../components/CommentsBlock';
import styles from './PostDetailsPage.module.scss';
import classNames from 'classnames';
import { Download } from '@mui/icons-material';

export const PostDetailsPage = ({ isPatient, patient }) => {
   const [data, setData] = React.useState();
   const [isLoading, setLoading] = React.useState(true);
   const { id } = useParams();
   const [documentUrl, setDocumentUrl] = React.useState(''); // Состояние для хранения URL загруженного документа
   const inputFileRef = React.useRef(null);
   const userData = useSelector((state) => state.auth.data);

   React.useEffect(() => {
      axios
         .get(`/posts/${id}`)
         .then((res) => {
            setData(res.data);
            setLoading(false);
         })
         .catch((err) => {
            console.warn(err);
            alert('ошибка при получении статьи');
         });
   }, []);

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

   const handleSaveDocument = async () => {
      alert('Документ сохранен!');
   };

   if (isLoading) {
      return <Post isLoading={isLoading} isFullPost />;
   }

   const isEditable = () => {
      if (data?.user._id === userData?._id) {
         return true;
      }
   };

   return (
      <div className={styles.root}>
         <div className={styles.postBlock}>
            <div className={classNames(styles.headData, styles.wrapper)}>
               <div className={styles.userInfo}>
                  <img src={data.user.avatarUrl} alt="" className={styles.userImg} />
                  <div>
                     <p className={styles.doctorName}>Врач: {data.user.fullName}</p>
                     <p>{data.user.additionalText}</p>
                  </div>
               </div>
               <h3 className={styles.title}>{data.title}</h3>

               <div className={styles.tags}>
                  {data.tags.map((name) => (
                     <span key={name}>
                        <Link to={`/tag/${name}`}>#{name}</Link>
                     </span>
                  ))}
               </div>

               <img
                  src={data.imageUrl ? `${baseURL}${data.imageUrl}` : ''}
                  alt=""
                  className={styles.postImg}
               />
            </div>

            <div className={styles.wrapper}>
               <ReactMarkdown children={data.text} />
            </div>

            <div className={styles.wrapper}>
               <div className={styles.postMeta}>
                  <div className={styles.postMetaBlock}>
                     <EyeIcon />
                     <span>{data.viewsCount}</span>
                  </div>
                  <div className={styles.postMetaBlock}>
                     <CommentIcon />
                     <span>{data.commentsCount || 0}</span>
                  </div>
               </div>
            </div>
         </div>

         {data?.user._id === userData?._id && !isPatient && (
            <Link
               style={{
                  color: '#fff',
               }}
               to={`/posts/${id}/edit`}>
               <div className={styles.button}>
                  <EditIcon />
                  <span>Изменить данные</span>
               </div>
            </Link>
         )}
         {data?.title == patient?.fullName && isPatient && (
            <div
               className="editButtons"
               style={{
                  backgroundColor: 'white',
                  color: 'black',
                  marginBottom: '10px',
                  width: '250px',
               }}>
               <Link to={`/posts/${id}/edit`}>
                  <IconButton color="primary">
                     <EditIcon />
                  </IconButton>
               </Link>
               <>{isPatient && <span>Добавить Документы</span>}</>
            </div>
         )}

         {/* Отображение загруженных документов */}
         {data.documentUrl && (
            <a
               className={styles.downloadLink}
               href={`${baseURL}${data.documentUrl}`}
               download="Документ.docx">
               <div div className={classNames(styles.downloadBlock, styles.wrapper)}>
                  <p>{data.documentUrl.split('/')[2]}</p>
                  <Download />
               </div>
            </a>
         )}
         {/* <CommentsBlock
            items={[
               {
                  user: {
                     fullName: 'Вася Пупкин',
                     avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                  },
                  text: 'Это тестовый комментарий 555555',
               },
               {
                  user: {
                     fullName: 'Иван Иванов',
                     avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                  },
                  text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
               },
            ]}
            isLoading={false}>
            <Index />
         </CommentsBlock> */}
      </div>
   );
};
