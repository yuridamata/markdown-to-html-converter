import { ConversionResult } from './entities';

/**
 * Interface for file system operations
 */
export interface IFileSystemRepository {
  findMarkdownFiles(folderPath: string): Promise<string[]>;
  getRelativePath(fullPath: string, basePath: string): string;
  createDirectory(dirPath: string): Promise<void>;
  fileExists(filePath: string): Promise<boolean>;
}

/**
 * Interface for markdown to rich text conversion
 */
export interface IMarkdownConverter {
  convert(inputPath: string, outputPath: string): Promise<void>;
}

/**
 * Interface for conversion service
 */
export interface IConversionService {
  convertFolder(
    sourceFolderPath: string,
    destinationFolderPath: string
  ): Promise<ConversionResult[]>;
}

/**
 * Interface for path resolver
 */
export interface IPathResolver {
  resolvePath(inputPath: string): string;
  normalizeOutputPath(inputPath: string): string;
}
