import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const DATA_FILE = path.resolve('data', 'tasks.json')

// タスクを data/tasks.json に読み書きする API (GET/PUT /api/tasks)
function tasksApi() {
  const handler = (req, res, next) => {
    if (req.url?.split('?')[0] !== '/api/tasks') return next()
    res.setHeader('Content-Type', 'application/json; charset=utf-8')

    if (req.method === 'GET') {
      res.end(fs.existsSync(DATA_FILE) ? fs.readFileSync(DATA_FILE, 'utf-8') : '[]')
      return
    }

    if (req.method === 'PUT') {
      let body = ''
      req.on('data', (chunk) => (body += chunk))
      req.on('end', () => {
        try {
          const tasks = JSON.parse(body)
          if (!Array.isArray(tasks)) throw new Error('配列ではありません')
          fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
          fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8')
          res.end('{"ok":true}')
        } catch (e) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: e.message }))
        }
      })
      return
    }

    res.statusCode = 405
    res.end('{"error":"Method Not Allowed"}')
  }

  return {
    name: 'tasks-api',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

export default defineConfig({
  // GitHub Pages(/リポジトリ名/)でも動くよう相対パスにする
  base: './',
  plugins: [react(), tasksApi()],
})
