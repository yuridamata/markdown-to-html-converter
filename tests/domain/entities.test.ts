import { MarkdownFile, ConversionResult } from '../../src/domain/entities';

describe('Domain Entities', () => {
  describe('MarkdownFile', () => {
    it('should create a markdown file instance with properties', () => {
      const file = new MarkdownFile('/source/file.md', '/dest/file.rtf', 'file.md');

      expect(file.sourcePath).toBe('/source/file.md');
      expect(file.destinationPath).toBe('/dest/file.rtf');
      expect(file.relativePath).toBe('file.md');
    });
  });

  describe('ConversionResult', () => {
    it('should create successful conversion result', () => {
      const result = new ConversionResult('/source/file.md', '/dest/file.rtf', true);

      expect(result.sourcePath).toBe('/source/file.md');
      expect(result.destinationPath).toBe('/dest/file.rtf');
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should create failed conversion result with error message', () => {
      const result = new ConversionResult('/source/file.md', '', false, 'Conversion error');

      expect(result.sourcePath).toBe('/source/file.md');
      expect(result.destinationPath).toBe('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Conversion error');
    });
  });
});
