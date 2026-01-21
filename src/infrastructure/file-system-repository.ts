import { promises as fs } from 'fs';
import * as path from 'path';
import { IFileSystemRepository } from '../domain/interfaces';

/**
 * Implementation of file system repository
 */
export class FileSystemRepository implements IFileSystemRepository {
  async findMarkdownFiles(folderPath: string): Promise<string[]> {
    const markdownFiles: string[] = [];

    const traverse = async (currentPath: string): Promise<void> => {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          await traverse(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          markdownFiles.push(fullPath);
        }
      }
    };

    await traverse(folderPath);
    return markdownFiles;
  }

  getRelativePath(fullPath: string, basePath: string): string {
    return path.relative(basePath, fullPath);
  }

  async createDirectory(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
