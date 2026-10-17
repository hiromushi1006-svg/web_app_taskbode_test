const API_URL = 'api/tasks'
const LS_KEY = 'task-board:tasks'

// API(data/tasks.json)が使えれば 'api'、使えない環境(GitHub Pagesなど)では 'local'
let mode = 'api'

export async function loadTasks() {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(res.status)
    mode = 'api'
    return await res.json()
  } catch {
    mode = 'local'
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
  }
}

export async function saveTasks(tasks) {
  if (mode === 'local') {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks))
    return
  }
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tasks),
  })
  if (!res.ok) throw new Error(res.status)
}
