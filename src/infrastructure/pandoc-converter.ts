import { execFile } from 'child_process';
import { promisify } from 'util';
import { IMarkdownConverter } from '../domain/interfaces';

const execFileAsync = promisify(execFile);

/**
 * Implementation of markdown converter using pandoc
 */
export class PandocMarkdownConverter implements IMarkdownConverter {
  async convert(inputPath: string, outputPath: string): Promise<void> {
    try {
      await execFileAsync('pandoc', [inputPath, '-t', 'html', '-o', outputPath]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to convert ${inputPath}: ${error.message}`);
      }
      throw new Error(`Failed to convert ${inputPath}: Unknown error`);
    }
  }
}
