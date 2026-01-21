import * as path from 'path';
import { IPathResolver } from '../domain/interfaces';

/**
 * Implementation of path resolver
 */
export class PathResolver implements IPathResolver {
  resolvePath(inputPath: string): string {
    if (path.isAbsolute(inputPath)) {
      return inputPath;
    }
    return path.resolve(process.cwd(), inputPath);
  }

  normalizeOutputPath(inputPath: string): string {
    const ext = path.extname(inputPath);
    if (ext === '.md') {
      return inputPath.replace(/\.md$/, '.html');
    }
    return inputPath + '.html';
  }
}
