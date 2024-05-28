import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'

import styles from './Post.module.scss'
import { UserInfo } from '../UserInfo'
import { PostSkeleton } from './Skeleton'
import { fetchRemovePost } from '../../redux/slices/post'

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
  patient,
  isChek,
  isPatient
}) => {
  const dispatch = useDispatch()
  if (isLoading) {
    return <PostSkeleton />
  }

  // console.log(isChek, 23488348234843);

  const onClickRemove = () => {
    if (window.confirm('Вы уверены что хотите удалить статью?')) {
      dispatch(fetchRemovePost(id))
    }
  }

  return (
    <div
      className={clsx(styles.root, { [styles.rootFull]: isFullPost })}
      style={{ maxWidth: isFullPost ? 'unset' : 370 }}
    >
      <Link to={`/posts/${id}`}>
        {isEditable && !isPatient && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles.editButtons}
          >
            <Link to={`/posts/${id}/edit`}>
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                onClickRemove()
              }}
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        {imageUrl && (
          <img
            className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
            src={imageUrl}
            alt={title}
          />
        )}
        <div className={styles.wrapper}>
          <div className={styles.indention}>
            <h2
              className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
            >
              {title}
            </h2>
            <ul className={styles.tags}>
              {tags.map((name) => (
                <li key={name}>
                  <Link to={`/tag/${name}`}>#{name}</Link>
                </li>
              ))}
            </ul>
            <UserInfo {...user} additionalText={createdAt} />

            {children && <div className={styles.content}>{children}</div>}
            <ul className={styles.postDetails}>
              <li>
                <EyeIcon />
                <span>{viewsCount}</span>
              </li>
              <li>
                <CommentIcon />
                <span>{commentsCount}</span>
              </li>
            </ul>
          </div>
        </div>
      </Link>
    </div>
  )
}
