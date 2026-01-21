import { FileSystemRepository } from '../../src/infrastructure/file-system-repository';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

describe('FileSystemRepository', () => {
  let repository: FileSystemRepository;
  let tempDir: string;

  beforeEach(async () => {
    repository = new FileSystemRepository();
    // Create a temporary directory for testing
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'test-'));
  });

  afterEach(async () => {
    // Clean up temporary directory
    try {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('findMarkdownFiles', () => {
    it('should find all markdown files in a directory recursively', async () => {
      // Create test files
      await fs.promises.writeFile(path.join(tempDir, 'file1.md'), 'content');
      await fs.promises.writeFile(path.join(tempDir, 'file2.txt'), 'content');
      await fs.promises.mkdir(path.join(tempDir, 'subdir'));
      await fs.promises.writeFile(path.join(tempDir, 'subdir', 'file3.md'), 'content');

      const result = await repository.findMarkdownFiles(tempDir);

      expect(result).toContain(path.join(tempDir, 'file1.md'));
      expect(result).toContain(path.join(tempDir, 'subdir', 'file3.md'));
      expect(result).not.toContain(path.join(tempDir, 'file2.txt'));
      expect(result.length).toBe(2);
    });

    it('should return empty array when no markdown files found', async () => {
      // Create a txt file only
      await fs.promises.writeFile(path.join(tempDir, 'file1.txt'), 'content');

      const result = await repository.findMarkdownFiles(tempDir);

      expect(result).toEqual([]);
    });

    it('should handle errors for non-existent directories', async () => {
      const nonExistentPath = path.join(tempDir, 'nonexistent');

      await expect(repository.findMarkdownFiles(nonExistentPath)).rejects.toThrow();
    });
  });

  describe('getRelativePath', () => {
    it('should return relative path from base path', () => {
      const result = repository.getRelativePath(path.join(tempDir, 'file.md'), tempDir);
      expect(result).toBe('file.md');
    });

    it('should handle nested paths', () => {
      const result = repository.getRelativePath(path.join(tempDir, 'subdir', 'file.md'), tempDir);
      expect(result).toBe(path.join('subdir', 'file.md'));
    });
  });

  describe('createDirectory', () => {
    it('should create directory recursively', async () => {
      const newPath = path.join(tempDir, 'new', 'nested', 'path');

      await repository.createDirectory(newPath);

      const exists = await fs.promises
        .stat(newPath)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);
    });

    it('should not throw when directory already exists', async () => {
      const existingPath = path.join(tempDir, 'existing');
      await fs.promises.mkdir(existingPath);

      // Should not throw
      await expect(repository.createDirectory(existingPath)).resolves.toBeUndefined();
    });
  });

  describe('fileExists', () => {
    it('should return true when file exists', async () => {
      const filePath = path.join(tempDir, 'test.md');
      await fs.promises.writeFile(filePath, 'content');

      const result = await repository.fileExists(filePath);

      expect(result).toBe(true);
    });

    it('should return false when file does not exist', async () => {
      const filePath = path.join(tempDir, 'nonexistent.md');

      const result = await repository.fileExists(filePath);

      expect(result).toBe(false);
    });
  });
});
