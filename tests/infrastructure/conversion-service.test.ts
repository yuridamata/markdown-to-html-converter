import { ConversionService } from '../../src/infrastructure/conversion-service';
import { IFileSystemRepository, IMarkdownConverter } from '../../src/domain/interfaces';

describe('ConversionService', () => {
  let service: ConversionService;
  let mockFileSystemRepository: jest.Mocked<IFileSystemRepository>;
  let mockMarkdownConverter: jest.Mocked<IMarkdownConverter>;

  beforeEach(() => {
    mockFileSystemRepository = {
      findMarkdownFiles: jest.fn(),
      getRelativePath: jest.fn(),
      createDirectory: jest.fn(),
      fileExists: jest.fn(),
    };

    mockMarkdownConverter = {
      convert: jest.fn(),
    };

    service = new ConversionService(mockFileSystemRepository, mockMarkdownConverter);
  });

  describe('convertFolder', () => {
    it('should convert all markdown files in folder', async () => {
      const mockFiles = ['/test/file1.md', '/test/subdir/file2.md'];

      mockFileSystemRepository.findMarkdownFiles.mockResolvedValue(mockFiles);
      mockFileSystemRepository.getRelativePath.mockImplementation((full, base) => {
        return full.replace(base + '/', '');
      });
      mockFileSystemRepository.createDirectory.mockResolvedValue(undefined);
      mockMarkdownConverter.convert.mockResolvedValue(undefined);

      const results = await service.convertFolder('/test', '/output');

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(mockMarkdownConverter.convert).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no markdown files found', async () => {
      mockFileSystemRepository.findMarkdownFiles.mockResolvedValue([]);

      const results = await service.convertFolder('/test', '/output');

      expect(results).toEqual([]);
      expect(mockMarkdownConverter.convert).not.toHaveBeenCalled();
    });

    it('should create destination directory', async () => {
      mockFileSystemRepository.findMarkdownFiles.mockResolvedValue(['/test/file.md']);
      mockFileSystemRepository.getRelativePath.mockReturnValue('file.md');
      mockFileSystemRepository.createDirectory.mockResolvedValue(undefined);
      mockMarkdownConverter.convert.mockResolvedValue(undefined);

      await service.convertFolder('/test', '/output');

      expect(mockFileSystemRepository.createDirectory).toHaveBeenCalledWith('/output');
    });

    it('should handle conversion errors gracefully', async () => {
      mockFileSystemRepository.findMarkdownFiles.mockResolvedValue(['/test/file.md']);
      mockFileSystemRepository.getRelativePath.mockReturnValue('file.md');
      mockFileSystemRepository.createDirectory.mockResolvedValue(undefined);
      mockMarkdownConverter.convert.mockRejectedValue(new Error('Conversion failed'));

      const results = await service.convertFolder('/test', '/output');

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('Conversion failed');
    });

    it('should preserve folder structure', async () => {
      const mockFiles = ['/test/docs/folder1/file1.md', '/test/docs/folder2/file2.md'];

      mockFileSystemRepository.findMarkdownFiles.mockResolvedValue(mockFiles);
      mockFileSystemRepository.getRelativePath.mockImplementation((full, base) => {
        return full.replace(base + '/', '');
      });
      mockFileSystemRepository.createDirectory.mockResolvedValue(undefined);
      mockMarkdownConverter.convert.mockResolvedValue(undefined);

      await service.convertFolder('/test/docs', '/output');

      expect(mockFileSystemRepository.createDirectory).toHaveBeenCalledWith(
        expect.stringContaining('folder1')
      );
      expect(mockFileSystemRepository.createDirectory).toHaveBeenCalledWith(
        expect.stringContaining('folder2')
      );
    });
  });
});
