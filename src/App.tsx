import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import type { Lesson } from './types'
import { Card, CardContent, Button, Progress } from './components/ui'
import Editor from '@monaco-editor/react'
import { useProgress } from './hooks/useProgress'

function useLessons() {
  const [lessons, setLessons] = useState<Pick<Lesson, 'id' | 'title'>[]>([])
  useEffect(() => {
    fetch('/api/lessons').then(r => r.json()).then(setLessons).catch(() => setLessons([]))
  }, [])
  return lessons
}

function useLesson(id: number) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  useEffect(() => {
    fetch(`/api/lessons/${id}`).then(r => r.json()).then(setLesson).catch(() => setLesson(null))
  }, [id])
  return lesson
}

function Navbar({ percent }: { percent: number }) {
  return (
    <div className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold">Μαθήματα JavaScript</Link>
        <div className="w-48"><Progress value={percent} /></div>
      </div>
    </div>
  )
}

function ListPage() {
  const lessons = useLessons()
  const { percent } = useProgress(lessons.length)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar percent={percent} />
      <div className="max-w-5xl mx-auto px-4 py-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map(l => (
          <Card key={l.id}>
            <CardContent>
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{l.title}</h3>
                <Link to={`/μάθημα/${l.id}`} className="mt-1">
                  <Button className="w-full">Έναρξη</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function RunnerFrame({ code }: { code: string }) {
  const srcDoc = useMemo(() => {
    const escaped = code
    return `<!doctype html><html><body><pre id="out" style="padding:12px"></pre><script>
      (function(){
        const out = document.getElementById('out');
        const log = (...args) => { out.textContent += args.join(' ') + '\n'; };
        const console = { log };
        try { new Function('console', ${JSON.stringify(escaped)})(console); } catch (e) { log('Σφάλμα:', e.message); }
      })();
    <\/script></body></html>`
  }, [code])
  return (
    <iframe title="sandbox" className="w-full h-48 border rounded" sandbox="allow-scripts" srcDoc={srcDoc} />
  )
}

function ViewerPage() {
  const params = useParams()
  const id = Number(params.id)
  const lesson = useLesson(id)
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const totalCount = 3 // future: derive from API list
  const { markCompleted } = useProgress(totalCount)

  useEffect(() => {
    if (lesson) setCode(lesson.starterCode)
  }, [lesson])

  if (!lesson) return <div className="p-6">Φόρτωση...</div>

  const prevId = id > 1 ? id - 1 : null
  const nextId = id + 1

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar percent={0} />
      <div className="max-w-5xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
          <p className="text-gray-700 whitespace-pre-wrap">{lesson.explanation}</p>
          <div className="flex gap-2">
            <Button onClick={() => markCompleted(lesson.id)}>Σήμανση ως ολοκληρωμένο</Button>
          </div>
          <div className="flex gap-2">
            {prevId && (
              <Button onClick={() => navigate(`/μάθημα/${prevId}`)}>Προηγούμενο</Button>
            )}
            <Button onClick={() => navigate(`/μάθημα/${nextId}`)}>Επόμενο</Button>
          </div>
        </div>
        <div className="space-y-3">
          <Editor height="300px" defaultLanguage="javascript" value={code} onChange={(v) => setCode(v ?? '')} theme="vs-dark" />
          <div className="flex gap-2">
            <Button onClick={() => setCode(lesson.starterCode)}>Επαναφορά Κώδικα</Button>
            <Button onClick={() => setCode(lesson.solution)}>Λύση</Button>
            <Button onClick={() => setCode(code)} className="bg-green-600 hover:bg-green-700">Εκτέλεση Κώδικα</Button>
          </div>
          <RunnerFrame code={code} />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/μάθημα/:id" element={<ViewerPage />} />
      </Routes>
    </BrowserRouter>
  )
}
