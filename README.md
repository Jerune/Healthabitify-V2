# Health App Next

A Next.js health application for tracking wearable device data and health metrics.

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- VS Code (recommended)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

## Code Quality Tools

This project uses ESLint and Prettier for code quality and formatting, configured to work seamlessly with Next.js, TypeScript, and Tailwind CSS.

### Available Scripts

- `npm run lint` - Check for ESLint issues
- `npm run lint:fix` - Automatically fix ESLint issues where possible
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if all files are properly formatted
- `npm run type-check` - Run TypeScript type checking

### ESLint Configuration

ESLint is configured with:

- Next.js core web vitals and TypeScript rules
- Import ordering and organization rules
- React hooks rules
- TypeScript-specific rules
- Code quality best practices

### Prettier Configuration

Prettier is configured with:

- Single quotes
- 2-space indentation
- 80 character line width
- Trailing commas
- Consistent formatting across all file types

### VS Code Setup

For the best development experience, install these VS Code extensions:

1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier** (`esbenp.prettier-vscode`)
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
4. **TypeScript Importer** (`pmneo.tsimporter`)

The project includes VS Code settings that automatically:

- Format code on save using Prettier
- Fix ESLint issues on save
- Organize imports on save
- Provide Tailwind CSS autocompletion

### Auto-formatting on Save

The VS Code configuration automatically:

- Formats your code with Prettier when you save
- Fixes ESLint issues that can be auto-fixed
- Organizes imports according to the project's rules
- Provides real-time ESLint feedback

### Import Organization

The project enforces consistent import ordering:

1. Built-in Node.js modules
2. External packages (React, Next.js, etc.)
3. Internal modules (components, features, etc.)
4. Relative imports
5. Type imports

### Tailwind CSS Integration

Tailwind CSS v4 is fully integrated with:

- Automatic class sorting
- IntelliSense support
- CSS validation
- PostCSS processing

## Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # Reusable React components
├── features/           # Feature-based modules
├── firebase/           # Firebase configuration and services
├── redux/              # Redux store and reducers
├── services/           # API and external service integrations
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Contributing

1. Ensure your code passes all linting checks: `npm run lint`
2. Format your code: `npm run format`
3. Check TypeScript types: `npm run type-check`
4. All checks should pass before committing

## Troubleshooting

### ESLint Issues

- Run `npm run lint:fix` to auto-fix issues
- Check the ESLint output for specific rule violations
- Ensure imports are properly ordered

### Prettier Issues

- Run `npm run format` to format all files
- Check VS Code Prettier extension is installed and enabled
- Verify `.prettierrc` configuration is loaded

### VS Code Not Auto-formatting

- Ensure the Prettier extension is installed
- Check that Prettier is set as the default formatter
- Verify the workspace settings are loaded
- Restart VS Code if issues persist
