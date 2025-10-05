import postcss from 'postcss'
import tailwind from '@tailwindcss/postcss'
import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// This test processes Tailwind via PostCSS and asserts a known utility exists.
// It validates that Tailwind is installed and resolvable in this project.

describe('tailwind postcss integration', () => {
  it('generates bg-blue-600 utility', async () => {
    // Ensure resolution happens from the app root where tailwindcss is installed
    const here = dirname(fileURLToPath(import.meta.url))
    const appRoot = resolve(here, '..', '..')
    const fromPath = resolve(appRoot, 'src', 'input.css')
    const input = '@import "tailwindcss";'
    const result = await postcss([tailwind()]).process(input, { from: fromPath })
    expect(result.css).toContain('.bg-blue-600')
  })
})


