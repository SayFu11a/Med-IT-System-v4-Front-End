import React from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import axios, { baseURL } from '../axios'
import DocViewer from 'react-doc-viewer'
import Button from '@mui/material/Button'

import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

import { useDispatch, useSelector } from 'react-redux'

import { Post } from '../components/Post'
import { Index } from '../components/AddComment'
import { CommentsBlock } from '../components/CommentsBlock'

export const FullPost = ({ isPatient, patient }) => {
  const [data, setData] = React.useState()
  const [isLoading, setLoading] = React.useState(true)
  const { id } = useParams()
  const [documentUrl, setDocumentUrl] = React.useState('') // Состояние для хранения URL загруженного документа
  const inputFileRef = React.useRef(null)
  const userData = useSelector((state) => state.auth.data)

  console.log(data?.user._id, 'Врач   data?.user._id')
  console.log(userData?._id, 'current User   userData?._id')
  console.log(isPatient, 'isPatient')
  console.log(patient?.fullName, 'patient')
  console.log(data?.title, 'data title')

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.warn(err)
        alert('ошибка при получении статьи')
      })
  }, [])

  const handleDocumentUpload = async (event) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('document', file)
      const { data } = await axios.post('/uploadDocument', formData)
      setDocumentUrl(data.url)
    } catch (err) {
      console.warn(err)
      alert('ошибка при загрузке документа')
    }
  }

  const handleSaveDocument = async () => {
    // Здесь можно добавить логику сохранения URL загруженного документа на сервере
    alert('Документ сохранен!')
  }

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />
  }

  // console.log(data.documentUrl, 1111111111111111111111111111);

  const isEditable = () => {
    if (data?.user._id === userData?._id) {
      return true
    }
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `${baseURL}${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      {data?.user._id === userData?._id && !isPatient && (
        <div
          className="editButtons"
          style={{
            backgroundColor: 'white',
            color: 'black',
            marginBottom: '10px',
            width: '250px'
          }}
        >
          <Link
            style={{
              backgroundColor: 'white',
              color: 'black',
              marginBottom: '10px',
              width: '250px'
            }}
            to={`/posts/${id}/edit`}
          >
            <IconButton
              style={{
                backgroundColor: 'white',
                color: 'black'
              }}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Link>
          <span>Изменить данные</span>
        </div>
      )}
      {data?.title == patient?.fullName && isPatient && (
        <div
          className="editButtons"
          style={{
            backgroundColor: 'white',
            color: 'black',
            marginBottom: '10px',
            width: '250px'
          }}
        >
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
        <>
          <div
            style={{
              backgroundColor: 'white',
              color: 'black',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '10px'
            }}
          >
            {data.documentUrl}
          </div>
          <a
            href={`${baseURL}${data.documentUrl}`}
            download="Документ.docx"
            style={{
              backgroundColor: 'black',
              border: 'none',
              color: 'white',
              padding: '15px 32px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '16px',
              margin: '4px 2px',
              cursor: 'pointer',
              boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
              transition: '0.3s',
              borderRadius: '12px'
            }}
          >
            Download Document
          </a>
        </>
      )}
      <CommentsBlock
        items={[
          {
            user: {
              fullName: 'Вася Пупкин',
              avatarUrl: 'https://mui.com/static/images/avatar/1.jpg'
            },
            text: 'Это тестовый комментарий 555555'
          },
          {
            user: {
              fullName: 'Иван Иванов',
              avatarUrl: 'https://mui.com/static/images/avatar/2.jpg'
            },
            text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top'
          }
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  )
}
