# Kindle Notes Frontend

A modern React application for managing Kindle books and notes, built with React 19, TypeScript, and Vite.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (create .env file)
VITE_API_URL=http://your-api-url

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Tech Stack

- React 19 + TypeScript
- Vite (build tooling)
- TanStack React Query (server state)
- Tailwind CSS v4 (styling)
- Vitest + Testing Library (testing)
- Biome (linting/formatting)

## Key Features

- Browse and search Kindle books and notes
- Type-safe API integration with React Query
- Error boundaries and Suspense for loading states
- Responsive design with Tailwind CSS

## Development

For detailed information about the architecture, project structure, and development guidelines, see [CLAUDE.md](CLAUDE.md).

```bash
npm run dev          # Start dev server with HMR
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once (CI)
npm run check        # Lint and format checks
npm run check:fix    # Auto-fix issues
npm run build        # Build for production
npm run preview      # Preview production build
```

## Contributing

1. Follow the code style enforced by Biome
2. Write tests for new features
3. Run `npm run check` and `npm run test:run` before committing
4. See [CLAUDE.md](CLAUDE.md) for architecture guidelines

## License

[Add your license here]