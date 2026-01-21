#!/usr/bin/env node

import { PandocMarkdownConverter } from './infrastructure/pandoc-converter';
import { FileSystemRepository } from './infrastructure/file-system-repository';
import { ConversionService } from './infrastructure/conversion-service';
import { PathResolver } from './infrastructure/path-resolver';
import { ConvertMarkdownFolderUseCase } from './application/use-cases';
import { CliPresenter } from './presentation/cli-presenter';

async function main(): Promise<void> {
  // Parse command line arguments
  const args = process.argv.slice(2);

  // Handle help flag before any processing
  if (args.includes('--help') || args.includes('-h')) {
    console.log(
      `Usage: md2rt [sourceFolder] [destinationFolder]\n\n` +
        `- sourceFolder: Path to folder containing .md files (default: current directory)\n` +
        `- destinationFolder: Output folder (default: sourceFolder)\n` +
        `Examples:\n` +
        `  md2rt                     # convert current folder in place\n` +
        `  md2rt docs               # convert docs -> docs (in place)\n` +
        `  md2rt docs out/docs-rtf  # convert docs -> out/docs-rtf`
    );
    return;
  }

  // Get source folder path (default to current directory)
  const sourceFolder = args[0] || process.cwd();

  // Get destination folder (default to current directory)
  const destinationFolder = args[1] || sourceFolder;

  // Create dependencies
  const fileSystemRepository = new FileSystemRepository();
  const markdownConverter = new PandocMarkdownConverter();
  const conversionService = new ConversionService(fileSystemRepository, markdownConverter);
  const pathResolver = new PathResolver();

  // Create use case
  const useCase = new ConvertMarkdownFolderUseCase(conversionService);

  // Create presenter and execute
  const presenter = new CliPresenter(pathResolver);
  await presenter.present(useCase, sourceFolder, destinationFolder);
}

main().catch((error) => {
  console.error('Fatal error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
