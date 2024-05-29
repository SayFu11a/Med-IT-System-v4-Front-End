import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styles from './Home.module.scss';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/post';
import { baseURL } from '../axios';

// import { get } from 'react-hook-form';

export const Home = ({ isPatient, patient }) => {
   const dispatch = useDispatch();
   const userData = useSelector((state) => state.auth.data);
   const { posts, tags } = useSelector((state) => state.posts);

   const isPostsLoading = posts.status === 'loading';
   const isTagsLoading = tags.status === 'loading';

   React.useEffect(() => {
      dispatch(fetchPosts());
      dispatch(fetchTags());
   }, []);

   return (
      <div className={styles.root}>
         <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
            <Tab label="Главная" />
         </Tabs>
         <div className={styles.content}>
            <div className={styles.postsList}>
               {isPostsLoading ? (
                  // Вывод загрузочных элементов, если данные все еще загружаются
                  [...Array(5)].map((_, index) => <Post key={index} isLoading={true} />)
               ) : (
                  <>
                     {/* Вывод компонента для пациента (если применимо) */}
                     {isPatient &&
                        patient &&
                        posts.items
                           .filter((obj) => obj.title === patient.fullName) // Фильтруем посты по условию
                           .map((obj, index) => (
                              <Post
                                 key={index}
                                 id={obj._id}
                                 title={obj.title}
                                 imageUrl={obj.imageUrl ? `${baseURL}${obj.imageUrl}` : ''}
                                 user={obj.user}
                                 createdAt={obj.createdAt}
                                 viewsCount={obj.viewsCount}
                                 commentsCount={3}
                                 tags={obj.tags}
                                 isEditable={userData?._id === obj.user._id}
                                 isChek={obj.user}
                                 isPatient={isPatient}
                              />
                           ))}

                     {/* Вывод элементов <Post> */}
                     {!isPatient &&
                        posts.items.map((obj, index) => (
                           <Post
                              key={index}
                              id={obj._id}
                              title={obj.title}
                              imageUrl={obj.imageUrl ? `${baseURL}${obj.imageUrl}` : ''}
                              user={obj.user}
                              createdAt={obj.createdAt}
                              viewsCount={obj.viewsCount}
                              commentsCount={3}
                              tags={obj.tags}
                              isEditable={userData?._id === obj.user._id}
                              isChek={obj.user}
                           />
                        ))}
                  </>
               )}
            </div>

            <div className={styles.contentRight}>
               <TagsBlock items={tags.items} isLoading={isTagsLoading} />
               <CommentsBlock
                  items={[
                     {
                        user: {
                           fullName: 'Максим Данилов',
                           avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                        },
                        text: `Понедельник, Вторник, Среда: 08:00 - 18:00`,
                     },
                     {
                        user: {
                           fullName: 'Дмитрий Лебедь',
                           avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                        },
                        text: `Понедельник, Вторник, Среда, Четверг, Пятница,  Суббота: 08:00 - 18:00`,
                     },
                  ]}
                  isLoading={false}
               />
            </div>
         </div>
      </div>
   );
};
