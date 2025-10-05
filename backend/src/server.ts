import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs/promises'
import { z } from 'zod'

const app = express()
app.use(cors())
app.use(express.json())

const lessonSchema = z.object({
  id: z.number(),
  title: z.string(),
  explanation: z.string(),
  starterCode: z.string(),
  solution: z.string(),
})

const lessonsDir = path.resolve(process.cwd(), '..', 'lessons')

app.get('/api/lessons', async (_req, res) => {
  try {
    const files = await fs.readdir(lessonsDir)
    const lessons = [] as Array<z.infer<typeof lessonSchema>>
    for (const file of files) {
      if (!file.endsWith('.json')) continue
      const raw = await fs.readFile(path.join(lessonsDir, file), 'utf8')
      const json = JSON.parse(raw)
      const parsed = lessonSchema.safeParse(json)
      if (parsed.success) lessons.push(parsed.data)
    }
    lessons.sort((a, b) => a.id - b.id)
    res.json(lessons.map(l => ({ id: l.id, title: l.title })))
  } catch (err) {
    res.status(500).json({ error: 'Σφάλμα φόρτωσης μαθημάτων' })
  }
})

app.get('/api/lessons/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Μη έγκυρο id' })
    const file = path.join(lessonsDir, `${id}.json`)
    const raw = await fs.readFile(file, 'utf8')
    const parsed = lessonSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) return res.status(500).json({ error: 'Μη έγκυρη δομή μαθήματος' })
    res.json(parsed.data)
  } catch (err) {
    res.status(404).json({ error: 'Το μάθημα δεν βρέθηκε' })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
