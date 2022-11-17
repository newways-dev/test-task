import { useEffect, useState } from 'react'
import { database } from '../../firebase'
import { Todo } from '../../components'
import { TodoType } from '../../types/todo'
import styles from './Home.module.scss'
import { collection, onSnapshot } from 'firebase/firestore'

export const Home = () => {
  const [todos, setTodos] = useState<TodoType[]>([])

  useEffect(() => {
    const ununsubscribe = onSnapshot(
      collection(database, 'todos'),
      (snapshot) => {
        setTodos(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as TodoType)
          )
        )
      }
    )
    return ununsubscribe
  }, [])

  return (
    <div className={styles.home}>
      <div className={styles.top}>
        <h1 className={styles.title}>Todo List</h1>
      </div>
      <div className={styles.todos}>
        {todos.map((todo) => (
          <Todo
            id={todo.id}
            key={todo.id}
            heading={todo.heading}
            description={todo.description}
            deadLine={todo.deadLine}
          />
        ))}
      </div>
    </div>
  )
}
