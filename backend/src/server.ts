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
  track: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  content: z.string(),
  starterCode: z.string(),
  solution: z.string(),
})

// Parse frontmatter from MDX content
function parseFrontmatter(content: string): { frontmatter: any; content: string } {
  // More flexible regex that handles different line endings and encoding
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    console.log('No frontmatter match found. Content preview:', content.substring(0, 200));
    throw new Error('No frontmatter found in lesson');
  }
  
  const frontmatterText = match[1];
  const contentText = match[2];
  
  // Parse YAML-like frontmatter
  const frontmatter: any = {};
  frontmatterText.split(/\r?\n/).forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      if (key && value) {
        frontmatter[key] = value;
      }
    }
  });
  
  return { frontmatter, content: contentText };
}

// Extract code blocks from content
function extractCodeBlocks(content: string): { starterCode: string; solution: string } {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: string[] = [];
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push(match[2].trim());
  }
  
  // First code block is usually the example, second is the solution
  const starterCode = blocks[0] || '';
  const solution = blocks[blocks.length - 1] || starterCode;
  
  return { starterCode, solution };
}

// Convert markdown to HTML (basic implementation)
function markdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>')
    // Line breaks
    .replace(/\n/gim, '<br>');
}

// Parse a complete lesson from MDX content
function parseLesson(content: string): any {
  const { frontmatter, content: markdownContent } = parseFrontmatter(content);
  const { starterCode, solution } = extractCodeBlocks(markdownContent);
  
  return {
    id: parseInt(frontmatter.id),
    title: frontmatter.title,
    track: frontmatter.track,
    difficulty: frontmatter.difficulty || 'beginner',
    content: markdownToHtml(markdownContent),
    starterCode,
    solution
  };
}

const lessonsDir = path.resolve(process.cwd(), '..', 'frontend', 'src', 'lessons')

app.get('/api/lessons', async (_req, res) => {
  try {
    console.log('Lessons directory:', lessonsDir);
    const tracks = ['javascript', 'react', 'typescript'];
    const lessons = [] as Array<z.infer<typeof lessonSchema>>;
    
    for (const track of tracks) {
      const trackDir = path.join(lessonsDir, track);
      console.log('Checking track directory:', trackDir);
      try {
        const files = await fs.readdir(trackDir);
        console.log(`Files in ${track}:`, files);
        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const filePath = path.join(trackDir, file);
            console.log('Processing MDX file:', filePath);
            const content = await fs.readFile(filePath, 'utf8');
            const lesson = parseLesson(content);
            console.log('Parsed lesson:', lesson);
            const parsed = lessonSchema.safeParse(lesson);
            if (parsed.success) {
              lessons.push(parsed.data);
              console.log('Added lesson:', parsed.data.title);
            } else {
              console.error('Failed to parse lesson:', parsed.error);
            }
          }
        }
      } catch (err) {
        console.error(`Error reading track ${track}:`, err);
        continue;
      }
    }
    
    console.log('Total lessons found:', lessons.length);
    lessons.sort((a, b) => a.id - b.id);
    res.json(lessons.map(l => ({ id: l.id, title: l.title, track: l.track, difficulty: l.difficulty })));
  } catch (err) {
    console.error('Error loading lessons:', err);
    res.status(500).json({ error: 'Σφάλμα φόρτωσης μαθημάτων' });
  }
})

app.get('/api/lessons/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Μη έγκυρο id' })
    
    const tracks = ['javascript', 'react', 'typescript'];
    
    for (const track of tracks) {
      const trackDir = path.join(lessonsDir, track);
      try {
        const files = await fs.readdir(trackDir);
        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const filePath = path.join(trackDir, file);
            const content = await fs.readFile(filePath, 'utf8');
            const lesson = parseLesson(content);
            
            if (lesson.id === id) {
              const parsed = lessonSchema.safeParse(lesson);
              if (!parsed.success) return res.status(500).json({ error: 'Μη έγκυρη δομή μαθήματος' });
              return res.json(parsed.data);
            }
          }
        }
      } catch (err) {
        // Track directory doesn't exist, skip
        continue;
      }
    }
    
    res.status(404).json({ error: 'Το μάθημα δεν βρέθηκε' });
  } catch (err) {
    console.error('Error loading lesson:', err);
    res.status(500).json({ error: 'Σφάλμα φόρτωσης μαθήματος' });
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
