import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { useState, DetailedHTMLProps, HTMLAttributes, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import styles from './Todo.module.scss'
import { deleteDoc, doc } from 'firebase/firestore'
import { database } from '../../firebase'
import remove from '../../assets/delete.svg'
import clsx from 'clsx'

/**
 * Компонент Todo на главной странице
 */

export interface TodoProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  heading: string
  description: string
  deadLine: string
  id: string
}

export const Todo = ({ id, heading, description, deadLine }: TodoProps) => {
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [checked, setChecked] = useState<boolean>(false)
  const [late, setLate] = useState<boolean>(false)

  dayjs.extend(isSameOrAfter)
  const now = dayjs()
  const formatedDeadLine = dayjs(deadLine).format('YYYY-MM-DD')

  const formatedNow = now.format('YYYY-MM-DD')

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(database, 'todos', id))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    /**
     * Если задача просрочена фон станет красным
     * Если задача не просрочена и отмечена как выполненная
     * фон станет зеленым
     */
    if (
      now.isSameOrAfter(dayjs(formatedDeadLine)) &&
      formatedNow !== formatedDeadLine
    ) {
      setLate(true)
    }
  }, [now, formatedDeadLine, formatedNow])

  return (
    <div
      onMouseOver={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      className={clsx(
        styles.todo,
        { [styles.late]: late },
        { [styles.success]: checked && !late }
      )}
    >
      <input
        onChange={() => setChecked(!checked)}
        checked={checked}
        className={styles.checkbox}
        type='checkbox'
      />
      <Link to={`/update-todo/${id}`}>
        <div className={styles.wrapper}>
          <p className={styles.heading}>{heading}</p>
          <p className={styles.description}>{description}</p>
          <p className={styles.deadLine}>{deadLine}</p>
        </div>
      </Link>
      {showDelete && (
        <ReactSVG
          onClick={() => deleteTodo(id)}
          className={styles.delete}
          src={remove}
        />
      )}
    </div>
  )
}
