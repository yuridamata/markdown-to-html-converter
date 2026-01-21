import * as path from 'path';
import {
  IConversionService,
  IFileSystemRepository,
  IMarkdownConverter,
} from '../domain/interfaces';
import { ConversionResult } from '../domain/entities';

/**
 * Implementation of conversion service
 */
export class ConversionService implements IConversionService {
  constructor(
    private fileSystemRepository: IFileSystemRepository,
    private markdownConverter: IMarkdownConverter
  ) {}

  async convertFolder(
    sourceFolderPath: string,
    destinationFolderPath: string
  ): Promise<ConversionResult[]> {
    const results: ConversionResult[] = [];

    // Find all markdown files
    const markdownFiles = await this.fileSystemRepository.findMarkdownFiles(sourceFolderPath);

    if (markdownFiles.length === 0) {
      return results;
    }

    // Create destination folder if it doesn't exist
    await this.fileSystemRepository.createDirectory(destinationFolderPath);

    // Convert each markdown file
    for (const sourceFile of markdownFiles) {
      try {
        const relativePath = this.fileSystemRepository.getRelativePath(
          sourceFile,
          sourceFolderPath
        );

        // Create output path with .html extension
        const outputFileName = relativePath.replace(/\.md$/, '.html');
        const destinationFile = path.join(destinationFolderPath, outputFileName);

        // Create destination directory structure
        const destinationDir = path.dirname(destinationFile);
        await this.fileSystemRepository.createDirectory(destinationDir);

        // Convert the file
        await this.markdownConverter.convert(sourceFile, destinationFile);

        results.push(new ConversionResult(sourceFile, destinationFile, true));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push(new ConversionResult(sourceFile, '', false, errorMessage));
      }
    }

    return results;
  }
}
