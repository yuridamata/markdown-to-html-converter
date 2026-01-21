# VibeCoded - Markdown to Rich Text Converter

A simple TypeScript CLI tool that converts Markdown files to Rich Text (.rtf) format while preserving your folder structure. Built with clean architecture principles and fully tested.

## Features

- 🔄 **Batch Conversion**: Convert all Markdown files in a directory recursively
- 📁 **Structure Preservation**: Maintains the original folder structure in output
- 🎯 **Flexible Input**: Use current directory or specify a custom source path
- 💾 **Flexible Output**: Specify output directory or default to source directory
- ✅ **Clean Architecture**: Well-organized, maintainable code structure
- 🧪 **Fully Tested**: Comprehensive unit tests with 80%+ code coverage
- 📦 **Ready for NPM**: Properly configured for publishing to NPM registry

## Prerequisites

Before you begin, ensure you have the following installed:

### Linux/macOS
```bash
# Install Node.js (14 or higher)
# Using apt (Ubuntu/Debian):
sudo apt-get update
sudo apt-get install nodejs npm

# Using brew (macOS):
brew install node

# Install Pandoc
# Ubuntu/Debian:
sudo apt-get install pandoc

# macOS:
brew install pandoc
```

### Windows
1. **Node.js**: Download and install from [nodejs.org](https://nodejs.org/) (14 or higher)
2. **Pandoc**: Download and install from [pandoc.org](https://pandoc.org/installing.html)
3. **Git Bash** (optional but recommended): Download from [git-scm.com](https://git-scm.com/)

## Installation

### From NPM (when published)
```bash
npm install -g markdown-to-richtext
```

### Local Installation (Development)
```bash
# Clone the repository
git clone <repository-url>
cd markdown-to-richtext

# Install dependencies
npm install

# Build the project
npm run build
```

### Make the CLI available on your PATH

#### Linux/macOS
```bash
# Add global npm bin to PATH for this shell
export PATH="$(npm bin -g):$PATH"

# Persist it for future shells (bash/zsh)
echo 'export PATH="$(npm bin -g):$PATH"' >> ~/.bashrc   # or ~/.zshrc

# If using local install only, add project bin
export PATH="$PWD/node_modules/.bin:$PATH"
```

#### Windows (PowerShell)
```powershell
# Add global npm bin to PATH for current user
$npmBin = (npm bin -g)
[Environment]::SetEnvironmentVariable("PATH", "$npmBin;" + $env:PATH, "User")

# If using local install only, add project bin temporarily
$env:PATH = "$PWD/node_modules/.bin;" + $env:PATH
```

After updating PATH, open a new terminal and run `md2rt --help` to confirm the CLI is discoverable.

## Usage

### Basic Usage

Convert all Markdown files in the current directory:
```bash
# Linux/macOS
md2rt

# Windows
npx md2rt
```

### With Custom Source Directory

Convert all Markdown files from a specific folder:
```bash
# Linux/macOS
md2rt /path/to/markdown/files

# Windows (Command Prompt)
npx md2rt C:\path\to\markdown\files

# Windows (Git Bash)
npx md2rt /c/path/to/markdown/files
```

### With Custom Source and Destination

Specify both source and destination directories:
```bash
# Linux/macOS
md2rt /path/to/source /path/to/output

# Windows (Command Prompt)
npx md2rt C:\path\to\source C:\path\to\output

# Windows (Git Bash)
npx md2rt /c/path/to/source /c/path/to/output
```

### Examples

#### Example 1: Convert docs folder
```bash
# Linux/macOS
md2rt ./docs ./docs-rtf

# Windows
npx md2rt .\docs .\docs-rtf
```

#### Example 2: In-place conversion
```bash
# Convert all .md files in current directory to .rtf
# Linux/macOS
md2rt . .

# Windows
npx md2rt . .
```

#### Example 3: Batch convert project documentation
```bash
# Linux/macOS
md2rt ~/projects/myproject/docs ~/projects/myproject/docs-rtf

# Windows (Command Prompt)
npx md2rt C:\Users\YourName\projects\myproject\docs C:\Users\YourName\projects\myproject\docs-rtf
```

## Project Structure

```
markdown-to-richtext/
├── src/
│   ├── domain/                    # Domain layer (core business logic)
│   │   ├── entities.ts           # Domain models
│   │   └── interfaces.ts         # Domain interfaces
│   ├── application/               # Application layer (use cases)
│   │   └── use-cases.ts          # Business use cases
│   ├── infrastructure/            # Infrastructure layer (implementations)
│   │   ├── conversion-service.ts # Conversion service implementation
│   │   ├── file-system-repository.ts # File system operations
│   │   ├── pandoc-converter.ts   # Pandoc integration
│   │   └── path-resolver.ts      # Path resolution
│   ├── presentation/              # Presentation layer (CLI)
│   │   └── cli-presenter.ts      # CLI output handling
│   └── index.ts                  # Application entry point
├── tests/                         # Unit tests
│   ├── domain/                   # Domain layer tests
│   ├── application/              # Application layer tests
│   ├── infrastructure/           # Infrastructure layer tests
│   └── presentation/             # Presentation layer tests
├── package.json                  # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── jest.config.js               # Jest test configuration
├── .eslintrc.json              # ESLint configuration
├── .prettierrc.json            # Prettier configuration
└── README.md                    # This file
```

## Development

### Available Scripts

```bash
# Build the project
npm run build

# Run in development mode with ts-node
npm run dev

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Lint the code
npm run lint

# Format code with Prettier
npm run format

# Prepare for publication
npm run prepublishOnly
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch
```

### Building for Production

```bash
# Clean build
npm run build

# The compiled output will be in the `dist/` directory
```

## Architecture

This project follows **Clean Architecture** principles:

### Domain Layer (`src/domain/`)
- Contains core business logic and entities
- Independent of any external dependencies
- Defines interfaces for repositories and services

### Application Layer (`src/application/`)
- Contains use cases orchestrating domain entities
- Implements business rules
- Uses dependency injection for loosely coupled code

### Infrastructure Layer (`src/infrastructure/`)
- Implements domain interfaces
- Handles external services (Pandoc, file system)
- Manages I/O operations

### Presentation Layer (`src/presentation/`)
- Handles CLI interface and user output
- Formats and displays results
- Manages error presentation

## Code Quality

### Testing
- Unit tests for all components
- 80%+ code coverage target
- Jest framework with TypeScript support

### Linting & Formatting
- ESLint for code quality
- Prettier for consistent formatting
- TypeScript strict mode enabled

## Troubleshooting

### Issue: "pandoc: command not found"
**Solution**: Install Pandoc on your system
```bash
# Linux (Ubuntu/Debian)
sudo apt-get install pandoc

# macOS
brew install pandoc

# Windows: Download from https://pandoc.org/installing.html
```

### Issue: "No markdown files found"
**Solution**: Ensure your source directory contains `.md` files
```bash
# Check for markdown files
# Linux/macOS
find /path/to/folder -name "*.md"

# Windows (PowerShell)
Get-ChildItem -Path "C:\path\to\folder" -Filter "*.md" -Recurse
```

### Issue: Permission denied on output directory
**Solution**: Ensure write permissions on the output directory
```bash
# Linux/macOS
chmod 755 /path/to/output

# Windows: Right-click folder → Properties → Security → Edit
```

### Issue: Conversion fails with specific markdown files
**Solution**: Some markdown features may not be supported by the RTF format. Try:
1. Simplify the markdown syntax
2. Remove unsupported elements (complex tables, embedded media)
3. Check Pandoc documentation for RTF limitations

## Publishing to NPM

Before publishing, ensure you have:
1. An NPM account (https://www.npmjs.com/)
2. Logged in locally: `npm login`

Then publish:
```bash
npm publish
```

To install from NPM:
```bash
npm install -g markdown-to-richtext
```

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please open an issue on the project repository.

## Changelog

### Version 1.0.0
- Initial release
- Markdown to Rich Text conversion
- Folder structure preservation
- CLI interface
- Comprehensive test coverage
