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
    <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0f17]/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-white">MidnightJS</Link>
        <div className="w-48"><Progress value={percent} /></div>
      </div>
    </div>
  )
}

function HomePage() {
  const lessons = useLessons()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0b0f17]">
      <Navbar percent={0} />
      <div className="max-w-6xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">MidnightJS · Μάθε JavaScript στα Ελληνικά</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Πρακτικά μαθήματα με ζωντανό κώδικα, καθαρό σχεδιασμό, και εμπειρία τύπου freeCodeCamp —
            αλλά πιο σύγχρονη, μινιμαλιστική και ελληνική. Ξεκίνα, προχώρα με τον ρυθμό σου,
            και παρακολούθησε την πρόοδό σου.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate(lessons.length ? `/μάθημα/${lessons[0].id}` : '/')}>Ξεκίνα τώρα</Button>
            <Button className="bg-white/10 hover:bg-white/20" onClick={() => setOpen(v => !v)}>Προβολή μαθημάτων</Button>
          </div>
          {open && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 max-w-md">
              <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-2">Μαθήματα</h3>
              <ul className="space-y-2">
                {lessons.map(l => (
                  <li key={l.id}>
                    <button
                      className="w-full text-left px-3 py-2 rounded hover:bg-white/10 text-gray-200"
                      onClick={() => navigate(`/μάθημα/${l.id}`)}
                    >
                      {l.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="hidden lg:block">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
            <div className="aspect-video w-full rounded-xl bg-black/60 grid place-items-center text-gray-400">
              <span>Προεπισκόπηση περιβάλλοντος</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ListPage() {
  const lessons = useLessons()
  const { percent } = useProgress(lessons.length)
  return (
    <div className="min-h-screen bg-[#0b0f17]">
      <Navbar percent={percent} />
      <div className="max-w-6xl mx-auto px-4 py-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map(l => (
          <Card key={l.id}>
            <CardContent>
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-white">{l.title}</h3>
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
  const [showReadme, setShowReadme] = useState(true)
  const totalCount = 3 // future: derive from API list
  const { markCompleted } = useProgress(totalCount)

  useEffect(() => {
    if (lesson) setCode(lesson.starterCode)
  }, [lesson])

  if (!lesson) return <div className="p-6 text-white">Φόρτωση...</div>

  const prevId = id > 1 ? id - 1 : null
  const nextId = id + 1

  return (
    <div className="min-h-screen bg-[#0b0f17]">
      <Navbar percent={0} />
      <div className="relative max-w-full mx-auto" style={{ height: 'calc(100vh - 56px)' }}>
        {/* README drawer */}
        <div className={`absolute top-0 right-0 h-full w-full sm:w-[420px] border-l border-white/10 bg-black/70 backdrop-blur p-5 overflow-auto transition-transform ${showReadme ? 'translate-x-0' : 'translate-x-full'}`}>
          <h2 className="text-xl font-bold text-white mb-3">README</h2>
          <h3 className="text-lg font-semibold text-white mb-2">{lesson.title}</h3>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{lesson.explanation}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => markCompleted(lesson.id)}>Σήμανση ως ολοκληρωμένο</Button>
            {prevId && (
              <Button className="bg-white/10 hover:bg-white/20" onClick={() => navigate(`/μάθημα/${prevId}`)}>Προηγούμενο</Button>
            )}
            <Button className="bg-white/10 hover:bg-white/20" onClick={() => navigate(`/μάθημα/${nextId}`)}>Επόμενο</Button>
          </div>
        </div>

        {/* Editor full-bleed */}
        <div className="absolute inset-0">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(v) => setCode(v ?? '')}
            theme="vs-dark"
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
          {/* Floating controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap gap-2">
            <Button onClick={() => setCode(lesson.starterCode)}>Επαναφορά</Button>
            <Button onClick={() => setCode(lesson.solution)} className="bg-white/10 hover:bg-white/20">Λύση</Button>
            <Button onClick={() => setCode(code)} className="bg-green-600 hover:bg-green-700">Εκτέλεση</Button>
            <Button onClick={() => (window.location.href = '/')} className="bg-white/10 hover:bg-white/20">Αρχική</Button>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button className="bg-white/10 hover:bg-white/20" onClick={() => setShowReadme(v => !v)}>
              {showReadme ? 'Απόκρυψη README' : 'Εμφάνιση README'}
            </Button>
          </div>
        </div>
      </div>
      {/* Hidden runner in full-page mode: show output in README examples; keep iframe available for future */}
      {/* <RunnerFrame code={code} /> */}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/μάθημα/:id" element={<ViewerPage />} />
      </Routes>
    </BrowserRouter>
  )
}
