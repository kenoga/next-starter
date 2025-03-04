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
- `npm run email:dev` - Start email template preview server

# Code Style Guidelines

- **Imports**: Follow simple-import-sort order (external → internal)
- **Components**: Use functional components with named exports
- **Types**: Use TypeScript with Zod for validation
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Paths**: Use absolute imports with '@/' alias
- **CSS**: Use Tailwind with 'cn' utility for merging classes
- **Messages**: Use hardcoded strings from '@/messages' (i18n)
- **Error handling**: Form validation with Zod + React Hook Form
- **Structure**: UI components in src/components/ui, feature components in src/components

# Clean Code Guidelines

## Readability
- Use descriptive variable and function names (self-documenting code)
- Keep functions small and focused on a single responsibility
- Limit function arguments to 3 or fewer when possible
- Use destructuring for cleaner props handling
- Add JSDoc comments for complex functions
- Organize imports consistently (use simple-import-sort)
- Use blank lines to create logical groupings of code
- Prefer explicit return statements over implicit returns for complex logic

## Maintainability
- Follow the DRY principle (Don't Repeat Yourself)
- Extract reusable logic into custom hooks
- Use TypeScript interfaces/types for all component props
- Create utility functions for common operations
- Implement proper error boundaries and fallbacks
- Use environment variables for configuration
- Follow the principle of least privilege (minimize component API surface)
- Write tests for critical functionality

## Scalability
- Apply composition over inheritance
- Use component composition for complex UIs
- Implement proper state management (React Context, SWR, etc.)
- Consider code splitting for large features
- Design flexible APIs for components that may need future extension
- Create abstract components for common UI patterns
- Use feature flags for gradual feature rollout

## Best Practices
- Avoid nested ternary operators
- Limit nesting depth (maximum 2-3 levels)
- Use optional chaining and nullish coalescing where appropriate
- Prefer early returns over deeply nested conditionals
- Avoid side effects in render functions
- Use constants for magic values
- Implement proper loading and error states
- Apply defensive programming techniques

# Performance Optimization Guidelines

## Next.js Optimizations
- Use the `--turbo` flag with `next dev` for faster development builds
- Implement route segment config options like `fetchCache` and `revalidate` for API routes
- Add page-level data revalidation strategies using `revalidate` or `generateStaticParams`
- Utilize App Router for optimized component rendering and code-splitting
- Configure route groups to organize routes without affecting URL paths
- Implement React Server Components where possible to reduce client-side JavaScript

## Image Optimization
- Use Next.js Image component with proper width/height to prevent layout shifts
- Implement priority loading for above-the-fold images
- Apply responsive images with srcset using the sizes attribute
- Use the `quality` parameter to balance size and quality

## Code Splitting and Lazy Loading
- Implement `dynamic()` imports for heavy components that aren't needed immediately
- Use React.lazy() and Suspense for client-side component loading
- Create route groups to better organize and code split the application

## Caching Strategies
- Implement route segment configuration with proper cache settings
- Use SWR or React Query for client-side data fetching with caching
- Add HTTP Cache headers for static assets
- Implement server-side caching for database queries or API responses
- Use Edge Runtime for faster global response times

## JavaScript Optimization
- Implement `useMemo` and `useCallback` hooks for expensive computations
- Use `React.memo()` for component memoization to prevent unnecessary re-renders
- Add Web Vitals monitoring to track performance
- Implement virtualization for long lists with react-window or react-virtualized

## Font Optimization
- Use next/font to load optimized fonts with proper subsets
- Consider adding font-display: swap for better loading experience

## Database & API Performance
- Implement database query optimization with indexes
- Use Prisma middleware for query monitoring
- Add proper error handling and timeout mechanisms for API routes
- Consider implementing edge functions for global availability

## Third-party Scripts
- Add the `strategy` parameter to Script component (e.g., lazyOnload)
- Defer non-critical third-party scripts
- Consider using resource hints like preconnect and prefetch