import { useEffect, FormEvent, ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { database, storage } from '../../firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import styles from './CreateTodo.module.scss'

/**
 * Компонент для создания новой todo
 * Я оставляю возможно выбрать прошедшую дату
 * чтобы увидеть как отреагирует UI на невыполненную задачу
 */

export const CreateTodo = () => {
  const [file, setFile] = useState<File | null>(null)
  const [heading, setHeading] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [deadLine, setDeadLine] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const navigate = useNavigate()

  const uploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    let file = event.target.files && event.target.files[0]
    setFile(file)
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!heading || !deadLine) {
      alert('Heading and DeadLine are required!')
    }

    if (heading && deadLine) {
      try {
        await addDoc(collection(database, 'todos'), {
          heading,
          description,
          deadLine,
          url,
          timestamp: serverTimestamp(),
        })

        navigate('/')
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    const uploadFile = () => {
      if (file) {
        const fileRef = ref(storage, file?.name)
        const upload = uploadBytesResumable(fileRef, file)
        upload.on('state_changed', (error) => {
          console.log(error)
        })
        upload.on('state_changed', () => {
          getDownloadURL(upload.snapshot.ref).then((url) => {
            setUrl(url)
          })
        })
      }
    }
    uploadFile()
  }, [file])

  return (
    <div className={styles.createTodo}>
      <h1 className={styles.title}>Create Todo</h1>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.field}>
          <span className={styles.fieldName}>Heading</span>
          <input
            type='text'
            onChange={(e) => setHeading(e.target.value)}
            value={heading}
          />
        </div>
        <div className={styles.field}>
          <span className={styles.fieldName}>Description</span>
          <input
            type='text'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <div className={styles.field}>
          <span className={styles.fieldName}>DeadLine</span>
          <input
            type='date'
            onChange={(e) => setDeadLine(e.target.value)}
            value={deadLine}
          />
        </div>
        <div className={styles.field}>
          <span className={styles.fieldName}>Upload File</span>
          <input type='file' onChange={uploadFile} />
        </div>
        <button type='submit' className={styles.save}>
          Save Todo
        </button>
      </form>
    </div>
  )
}
