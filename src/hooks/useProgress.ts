import { useEffect, useState } from 'react'

const STORAGE_KEY = 'πρόοδος_μαθημάτων'

export function useProgress(totalLessons: number) {
  const [completed, setCompleted] = useState<Set<number>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return new Set()
      const arr = JSON.parse(raw) as number[]
      return new Set(arr)
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)))
  }, [completed])

  const markCompleted = (id: number) => setCompleted(prev => new Set(prev).add(id))

  const percent = totalLessons > 0 ? Math.round((completed.size / totalLessons) * 100) : 0

  return { completed, markCompleted, percent }
}
