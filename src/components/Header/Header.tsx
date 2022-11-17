import { Link } from 'react-router-dom'
import styles from './Header.module.scss'

export const Header = () => {
  return (
    <header className={styles.header}>
      <Link to='/'>
        <h1 className={styles.logo}>WomanUP Todo-list</h1>
      </Link>
      <Link to='/create-todo'>
        <button className={styles.createTodo}>Create Todo</button>
      </Link>
    </header>
  )
}
