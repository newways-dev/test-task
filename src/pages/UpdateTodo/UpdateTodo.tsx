import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { database, storage } from '../../firebase'
import { TodoType } from '../../types/todo'
import styles from './UpdateTodo.module.scss'

/**
 * Компонент для обновления todo
 * Кнопка Download File откроет новую страницу с файлом
 */

export const UpdateTodo = () => {
  const [todo, setTodo] = useState<TodoType>()
  const [newHeading, setNewHeading] = useState<string>('')
  const [newDescription, setNewDescription] = useState<string>('')
  const [newDeadLine, setNewDeadLine] = useState<string>('')
  const [newUrl, setNewUrl] = useState<string>('')
  const [newFile, setNewFile] = useState<File | null>(null)
  const { id } = useParams()
  const navigate = useNavigate()

  const uploadNewFile = (event: ChangeEvent<HTMLInputElement>) => {
    let file = event.target.files && event.target.files[0]
    setNewFile(file)
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (id) {
      const todosDoc = doc(database, 'todos', id)
      const newFields = {
        heading: newHeading ? newHeading : todo?.heading,
        description: newDescription ? newDescription : todo?.description,
        deadLine: newDeadLine ? newDeadLine : todo?.deadLine,
        url: newUrl ? newUrl : todo?.url,
        timestamp: serverTimestamp(),
      }

      await updateDoc(todosDoc, newFields)
      navigate('/')
    }
  }

  useEffect(() => {
    if (id) {
      try {
        const fetchTodo = async () => {
          const docRef = doc(database, 'todos', id)
          const snapshot = await getDoc(docRef)
          setTodo({ ...(snapshot.data() as TodoType) })
        }
        fetchTodo()
      } catch (error) {
        console.log(error)
      }
    }
  }, [id])

  useEffect(() => {
    const uploadNewFile = () => {
      if (newFile) {
        const fileRef = ref(storage, newFile?.name)
        const upload = uploadBytesResumable(fileRef, newFile)
        upload.on('state_changed', (error) => {
          console.log(error)
        })
        upload.on('state_changed', () => {
          getDownloadURL(upload.snapshot.ref).then((url) => {
            setNewUrl(url)
          })
        })
      }
    }
    uploadNewFile()
  }, [newFile])

  return (
    <div className={styles.updateTodo}>
      <h1 className={styles.title}>Update Todo</h1>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.field}>
          <span className={styles.fieldName}>Heading</span>
          <input
            type='text'
            placeholder={todo?.heading}
            onChange={(e) => setNewHeading(e.target.value)}
            value={newHeading}
          />
        </div>
        <div className={styles.field}>
          <span className={styles.fieldName}>Description</span>
          <input
            type='text'
            placeholder={todo?.description}
            onChange={(e) => setNewDescription(e.target.value)}
            value={newDescription}
          />
        </div>
        <div className={styles.field}>
          <span className={styles.fieldName}>DeadLine</span>
          <input
            type='date'
            onChange={(e) => setNewDeadLine(e.target.value)}
            value={newDeadLine}
          />
        </div>
        {todo?.url && (
          <div className={styles.field}>
            <a target='blank' href={`${todo?.url}`} className={styles.url}>
              Download File
            </a>
          </div>
        )}
        <div className={styles.field}>
          <span className={styles.fieldName}>Upload New File</span>
          <input placeholder={todo?.url} type='file' onChange={uploadNewFile} />
        </div>
        <button type='submit' className={styles.update}>
          Update Todo
        </button>
      </form>
    </div>
  )
}
