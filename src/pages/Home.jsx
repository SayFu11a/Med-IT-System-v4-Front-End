import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styles from './Home.module.scss';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

import { Link } from 'react-router-dom';

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

   const [tabValue, setTabValue] = useState(0);
   const [menuAnchor, setMenuAnchor] = useState(null);

   React.useEffect(() => {
      dispatch(fetchPosts());
      dispatch(fetchTags());
   }, [dispatch]);

   const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
   };

   const handleMenuOpen = (event) => {
      setMenuAnchor(event.currentTarget);
   };

   const handleMenuClose = () => {
      setMenuAnchor(null);
   };

   return (
      <div className={styles.root}>
         <Tabs
            onChange={handleTabChange}
            style={{ marginBottom: 15 }}
            value={tabValue}
            aria-label="basic tabs example">
            <Tab label="Главная" style={{ color: '#ffffff', backgroundColor: '#3f51b5' }} />
            <Link style={{ textDecoration: 'none' }} to="/About">
               <Tab
                  label="О нас"
                  style={{
                     color: '#ffffff',
                     backgroundColor: tabValue === 1 ? '#3f51b5' : 'rgba(63, 81, 181, 0.7)',
                  }}
               />
            </Link>
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
                                 id={obj?._id}
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
                              id={obj?._id}
                              title={obj.title}
                              imageUrl={obj.imageUrl ? `${baseURL}${obj.imageUrl}` : ''}
                              user={obj.user}
                              createdAt={obj.createdAt}
                              viewsCount={obj.viewsCount}
                              commentsCount={3}
                              tags={obj.tags}
                              isEditable={userData?._id === obj.user?._id}
                              isChek={obj.user}
                           />
                        ))}
                  </>
               )}
            </div>

            <div className={styles.contentRight}>
               <div className={styles.blocks}>
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
                           text: `Понедельник, Вторник, Среда, Четверг, Пятница, Суббота: 08:00 - 18:00`,
                        },
                     ]}
                     isLoading={false}
                  />
               </div>
               <IconButton
                  aria-label="menu"
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  className={styles.menuButton}>
                  <MenuIcon />
               </IconButton>
               <Menu
                  id="simple-menu"
                  anchorEl={menuAnchor}
                  keepMounted
                  open={Boolean(menuAnchor)}
                  onClose={handleMenuClose}>
                  <MenuItem onClick={handleMenuClose}>
                     <TagsBlock items={tags.items} isLoading={isTagsLoading} />
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
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
                              text: `Понедельник, Вторник, Среда, Четверг, Пятница, Суббота: 08:00 - 18:00`,
                           },
                        ]}
                        isLoading={false}
                     />
                  </MenuItem>
               </Menu>
            </div>
         </div>
      </div>
   );
};
