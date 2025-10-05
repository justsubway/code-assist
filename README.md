# MidnightJS - JavaScript Learning Platform

A modern, full-stack web application for learning JavaScript, React, and TypeScript in Greek. Built with a beautiful dark theme and interactive coding environment.

## 🚀 Features

### Core Features
- **Interactive Lessons**: Learn JavaScript, React, and TypeScript with hands-on coding
- **Full-Screen Editor**: Monaco Editor with syntax highlighting and IntelliSense
- **Safe Code Execution**: Sandboxed iframe environment for running user code
- **Progress Tracking**: LocalStorage-based progress system (upgradeable to accounts)
- **Greek Language**: All UI elements and lesson content in Greek
- **Responsive Design**: Works perfectly on desktop and mobile devices

### UI/UX Features
- **Dark/Midnight Theme**: Beautiful glass morphism design
- **Keyboard Shortcuts**: 
  - `Ctrl+R`: Reset code to starter
  - `Ctrl+L`: Show solution
  - `Ctrl+Enter`: Execute code
  - `Ctrl+?`: Toggle README drawer
- **README Drawer**: Toggleable instructions panel
- **Progress Bar**: Visual progress tracking
- **Lesson Navigation**: Previous/Next lesson buttons

### Technical Features
- **MDX Lessons**: Markdown-based lessons with frontmatter metadata
- **TypeScript**: Full type safety across frontend and backend
- **Modern Stack**: React + Vite + Node.js + Express
- **API-First**: RESTful API serving lesson content
- **Modular Architecture**: Clean separation of concerns

## 📚 Curriculum

### JavaScript Track (10 lessons)
1. Console.log και πρώτες εντολές
2. Μεταβλητές (let, const, var)
3. Αριθμοί και πράξεις
4. Συμβολοσειρές και template literals
5. Boolean και conditionals
6. Loops (for, while)
7. Συναρτήσεις και parameters
8. Arrays και array methods
9. Objects και destructuring
10. Error handling (try/catch)

### React Track (5 lessons)
1. Εισαγωγή στο React και JSX
2. Components και Props
3. State με useState
4. Effects με useEffect
5. React Router και navigation

### TypeScript Track (5 lessons)
1. Βασικοί τύποι (string, number, boolean)
2. Unions και type guards
3. Interfaces και type aliases
4. Generics και utility types
5. Advanced patterns και best practices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **React Router DOM** for navigation
- **Vitest** for testing

### Backend
- **Node.js** with TypeScript
- **Express** for API server
- **Zod** for schema validation
- **CORS** for cross-origin requests

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code linting
- **PostCSS** for CSS processing
- **Concurrently** for running multiple scripts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/justsubway/code-assist.git
   cd code-assist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

### Project Structure

```
codeassist/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lessons/         # MDX lesson files
│   │   ├── types.ts         # TypeScript types
│   │   └── App.tsx          # Main app component
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Node.js backend
│   ├── src/
│   │   └── server.ts        # Express server
│   ├── package.json
│   └── tsconfig.json
├── lessons/                 # Legacy JSON lessons (deprecated)
├── project-plan.json        # Project roadmap and todos
└── package.json             # Root package.json
```

## 📖 Usage

### For Learners
1. Visit the homepage to see available lessons
2. Click "Ξεκίνα τώρα" to start with the first lesson
3. Use the full-screen editor to write code
4. Toggle the README drawer for instructions
5. Use keyboard shortcuts for quick actions
6. Track your progress with the progress bar

### For Developers
1. Lessons are stored as MDX files in `frontend/src/lessons/`
2. Each lesson has frontmatter with metadata (id, title, track, difficulty)
3. The backend parses MDX files and serves them via API
4. The frontend renders lessons with the MDXRenderer component

## 🔧 Development

### Adding New Lessons

1. Create a new `.mdx` file in the appropriate track directory:
   ```
   frontend/src/lessons/javascript/11-new-lesson.mdx
   ```

2. Add frontmatter metadata:
   ```yaml
   ---
   id: 11
   title: "New Lesson Title"
   track: "javascript"
   difficulty: "beginner"
   ---
   ```

3. Write the lesson content in Markdown with code blocks

4. The lesson will automatically appear in the API and frontend

### API Endpoints

- `GET /api/lessons` - Get all lessons metadata
- `GET /api/lessons/:id` - Get specific lesson content

### Environment Variables

Create a `.env` file in the root directory:
```env
PORT=4000
NODE_ENV=development
```

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

## 📦 Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build

# Start production server
cd backend
npm start
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set build command: `cd backend && npm run build`
3. Set start command: `cd backend && npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by FreeCodeCamp's learning platform
- Built with modern web technologies
- Designed for Greek-speaking developers

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**MidnightJS** - Learn JavaScript the modern way, in Greek! 🌙✨
