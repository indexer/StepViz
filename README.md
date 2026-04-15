# StepViz

An interactive algorithm visualization app built with React, TypeScript, and Vite. Browse a library of 105+ algorithms, view step-by-step execution traces with syntax-highlighted code in TypeScript, Python, and Kotlin, or write your own code in the playground and watch it execute line by line.

## Features

### Algorithm Library
- 105+ algorithms across 8 categories: Sorting, Searching, Dynamic Programming, Graphs, Trees, Data Structures, Techniques, and Miscellaneous
- Each algorithm includes a description, complexity analysis, and step-by-step execution data
- Filter by category, difficulty, and search by name
- Code samples in TypeScript, Python, and Kotlin with Prism.js syntax highlighting

### Step-by-Step Visualizer
- Walk through each algorithm's execution one step at a time
- Variable tracking cards show current values and highlight changes
- Array visualization with index pointer labels (i, j, mid, etc.)
- Play/pause auto-stepping with adjustable speed
- Step explanations describe what each line does

### Code Playground
- Write or paste your own code in TypeScript, Python, or Kotlin
- Built-in line-by-line interpreter handles variables, arrays, loops, conditionals, and arithmetic
- Supports LeetCode-style code with class/function wrappers, typed parameters, and return statements
- Auto-initializes function parameters with sample data based on type annotations
- 6 preset examples (Fibonacci, Bubble Sort, Binary Search, Two Sum, Max Subarray, Climbing Stairs) available in all 3 languages
- Keyboard shortcuts for stepping (arrow keys), play/pause (space), and reset (R)

### UI / UX
- Dark theme (Kinetic Shell) with Material Symbols icons
- Responsive layout with sidebar navigation on desktop and bottom nav on mobile
- Glass-panel effects and smooth transitions
- Lazy-loaded routes and algorithm data for fast initial load

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build:** Vite 8
- **Styling:** Tailwind CSS 4
- **Routing:** React Router 7
- **Data Fetching:** TanStack React Query
- **Syntax Highlighting:** Prism.js
- **Testing:** Vitest + Testing Library
- **Linting:** ESLint with typescript-eslint

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run check` | Lint + type-check + test |
| `npm run docker:build` | Build Docker image |

## Project Structure

```
src/
  components/
    algorithm/      # AlgorithmCard, CodeHighlighter, StepByStepVisualizer, etc.
    layout/         # AppShell, Sidebar, TopBar, MobileNav
  data/
    algorithmSummaries.ts   # Lightweight summaries for library listing
    algorithmDetails.ts     # Lazy-loaded full algorithm data by category
    algorithms-*.ts         # Algorithm data split by category
  engine/
    interpreter.ts          # Line-by-line code interpreter (TS/Python/Kotlin)
    playgroundExamples.ts   # Preset code examples for the playground
  hooks/
    useAlgorithms.ts        # Data fetching hooks with lazy loading
  pages/
    LibraryPage.tsx         # Browse and filter algorithms
    AlgorithmDetailPage.tsx # View algorithm details and step-through
    CodeRunnerPage.tsx      # Interactive code playground
  types/
    algorithm.ts            # TypeScript interfaces
```
