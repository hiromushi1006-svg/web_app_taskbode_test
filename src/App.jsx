import { useEffect, useState } from 'react'
import { loadTasks, saveTasks } from './storage.js'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTasks()
      .then((data) => {
        setTasks(data)
        setLoaded(true)
      })
      .catch(() => setError('タスクの読み込みに失敗しました'))
  }, [])

  // 読み込み完了後、タスクが変わるたびに保存する
  useEffect(() => {
    if (!loaded) return
    saveTasks(tasks)
      .then(() => setError(''))
      .catch(() => setError('タスクの保存に失敗しました'))
  }, [tasks, loaded])

  const addTask = (e) => {
    e.preventDefault()
    const title = text.trim()
    if (!title) return
    setTasks([...tasks, { id: crypto.randomUUID(), title, done: false }])
    setText('')
  }

  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id))

  return (
    <main className="app">
      <h1>タスクボード</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <form className="add-form" onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="タスクを入力"
          aria-label="新しいタスク"
        />
        <button type="submit">追加</button>
      </form>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? 'task done' : 'task'}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              <span>{task.title}</span>
            </label>
            <button
              type="button"
              className="delete"
              onClick={() => deleteTask(task.id)}
              aria-label={`「${task.title}」を削除`}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
