import { PathResolver } from '../../src/infrastructure/path-resolver';

describe('PathResolver', () => {
  let resolver: PathResolver;

  beforeEach(() => {
    resolver = new PathResolver();
  });

  describe('resolvePath', () => {
    it('should return absolute path when absolute path is provided', () => {
      const absolutePath = '/absolute/path/to/folder';
      const result = resolver.resolvePath(absolutePath);
      expect(result).toBe(absolutePath);
    });

    it('should resolve relative path to absolute path', () => {
      const relativePath = './test/folder';
      const result = resolver.resolvePath(relativePath);
      expect(result).toContain('test/folder');
      expect(result).toBe(require('path').resolve(process.cwd(), relativePath));
    });

    it('should handle single dot as current directory', () => {
      const result = resolver.resolvePath('.');
      expect(result).toBe(process.cwd());
    });

    it('should handle parent directory reference', () => {
      const relativePath = '../test/folder';
      const result = resolver.resolvePath(relativePath);
      expect(result).toContain('test/folder');
    });
  });

  describe('normalizeOutputPath', () => {
    it('should replace .md extension with .rtf', () => {
      const result = resolver.normalizeOutputPath('/path/to/file.md');
      expect(result).toBe('/path/to/file.rtf');
    });

    it('should add .rtf extension if no extension exists', () => {
      const result = resolver.normalizeOutputPath('/path/to/file');
      expect(result).toBe('/path/to/file.rtf');
    });

    it('should replace multiple extensions correctly', () => {
      const result = resolver.normalizeOutputPath('/path/to/file.backup.md');
      expect(result).toBe('/path/to/file.backup.rtf');
    });
  });
});
