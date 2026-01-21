# Markdown to Rich Text Converter - Project Instructions

This is a TypeScript CLI tool for converting Markdown files to Rich Text format using Pandoc.

## Project Overview

- **Language**: TypeScript
- **Runtime**: Node.js 14+
- **Architecture**: Clean Architecture with layered structure
- **Testing**: Jest with comprehensive unit tests
- **CLI**: Built-in command-line interface with Pandoc integration

## Key Features Implemented

1. ✅ TypeScript configuration with strict mode
2. ✅ Node.js runtime with npm dependencies
3. ✅ Pandoc integration for conversion
4. ✅ CLI with source/destination path parameters
5. ✅ Folder structure preservation
6. ✅ Default to current directory if no path provided
7. ✅ Comprehensive README for Windows and Linux
8. ✅ Clean Architecture (Domain, Application, Infrastructure, Presentation layers)
9. ✅ Unit tests covering all code components
10. ✅ NPM publishing ready configuration

## Project Structure

```
src/
├── domain/          # Entities and interfaces
├── application/     # Use cases
├── infrastructure/  # Implementations (Pandoc, File System)
├── presentation/    # CLI interface
└── index.ts        # Entry point
```

## Running the Project

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm run test

# Development mode
npm run dev <source> [destination]

# Production (after build)
node dist/src/index.js <source> [destination]
```

## Testing

All components have unit tests with 80%+ coverage:

- Domain entities
- Use cases
- Infrastructure services (File system, Pandoc)
- Application layer
- CLI Presenter

Run tests with: `npm run test`
