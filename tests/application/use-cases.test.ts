import { ConvertMarkdownFolderUseCase } from '../../src/application/use-cases';
import { IConversionService } from '../../src/domain/interfaces';
import { ConversionResult } from '../../src/domain/entities';

describe('ConvertMarkdownFolderUseCase', () => {
  let useCase: ConvertMarkdownFolderUseCase;
  let mockConversionService: jest.Mocked<IConversionService>;

  beforeEach(() => {
    mockConversionService = {
      convertFolder: jest.fn(),
    };

    useCase = new ConvertMarkdownFolderUseCase(mockConversionService);
  });

  describe('execute', () => {
    it('should call conversion service with correct parameters', async () => {
      const mockResults = [new ConversionResult('/test/file.md', '/output/file.rtf', true)];

      mockConversionService.convertFolder.mockResolvedValue(mockResults);

      const results = await useCase.execute('/test', '/output');

      expect(mockConversionService.convertFolder).toHaveBeenCalledWith('/test', '/output');
      expect(results).toEqual(mockResults);
    });

    it('should return conversion results', async () => {
      const mockResults = [
        new ConversionResult('/test/file1.md', '/output/file1.rtf', true),
        new ConversionResult('/test/file2.md', '/output/file2.rtf', true),
      ];

      mockConversionService.convertFolder.mockResolvedValue(mockResults);

      const results = await useCase.execute('/test', '/output');

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
    });

    it('should handle conversion failures', async () => {
      const mockResults = [new ConversionResult('/test/file.md', '', false, 'Conversion error')];

      mockConversionService.convertFolder.mockResolvedValue(mockResults);

      const results = await useCase.execute('/test', '/output');

      expect(results[0].success).toBe(false);
      expect(results[0].error).toBe('Conversion error');
    });
  });
});
