# Development Commands

- `npm run dev` - Start dev server (port 3055)
- `npm run build` - Build for production (generates Prisma, DB push, Next.js build)
- `npm run lint` / `npm run lint:fix` - Run ESLint
- `npm run format:check` / `npm run format:write` - Check/fix formatting with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run all Jest tests
- `npm test -- -t "test name"` - Run specific Jest test
- `npm run test:watch` - Run tests in watch mode
- `npm run e2e` - Run Playwright E2E tests
- `npm run e2e:ui` - Run Playwright tests with UI

# Code Style Guidelines

- **Imports**: Follow simple-import-sort order (external → internal)
- **Components**: Use functional components with named exports
- **Types**: Use TypeScript with Zod for validation
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Paths**: Use absolute imports with '@/' alias
- **CSS**: Use Tailwind with 'cn' utility for merging classes
- **Messages**: Use hardcoded strings from '@/lib/messages'
- **Error handling**: Form validation with Zod + React Hook Form
- **Structure**: UI components in src/components/ui, feature components in src/components