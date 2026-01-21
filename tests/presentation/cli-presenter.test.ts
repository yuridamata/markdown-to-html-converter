import { CliPresenter } from '../../src/presentation/cli-presenter';
import { ConvertMarkdownFolderUseCase } from '../../src/application/use-cases';
import { IPathResolver } from '../../src/domain/interfaces';
import { ConversionResult } from '../../src/domain/entities';

describe('CliPresenter', () => {
  let presenter: CliPresenter;
  let mockPathResolver: jest.Mocked<IPathResolver>;
  let mockUseCase: Partial<ConvertMarkdownFolderUseCase>;
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    mockPathResolver = {
      resolvePath: jest.fn(),
      normalizeOutputPath: jest.fn(),
    };

    mockUseCase = {
      execute: jest.fn(),
    };

    presenter = new CliPresenter(mockPathResolver);

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock process.exit
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('present', () => {
    it('should display conversion start message', async () => {
      mockPathResolver.resolvePath.mockReturnValue('/resolved/path');
      (mockUseCase.execute as jest.Mock).mockResolvedValue([]);

      await presenter.present(mockUseCase as ConvertMarkdownFolderUseCase, '/test', '/output');

      expect(console.log).toHaveBeenCalledWith('🔄 Converting Markdown files to Rich Text...\n');
    });

    it('should display no files message when no markdown files found', async () => {
      mockPathResolver.resolvePath.mockReturnValue('/resolved/path');
      (mockUseCase.execute as jest.Mock).mockResolvedValue([]);

      await presenter.present(mockUseCase as ConvertMarkdownFolderUseCase, '/test', '/output');

      expect(console.log).toHaveBeenCalledWith('⚠️  No markdown files found in the source folder.');
    });

    it('should display success results', async () => {
      mockPathResolver.resolvePath.mockReturnValue('/resolved/path');
      const results = [
        new ConversionResult('/test/file1.md', '/output/file1.rtf', true),
        new ConversionResult('/test/file2.md', '/output/file2.rtf', true),
      ];
      (mockUseCase.execute as jest.Mock).mockResolvedValue(results);

      await presenter.present(mockUseCase as ConvertMarkdownFolderUseCase, '/test', '/output');

      expect(console.log).toHaveBeenCalledWith('✅ /test/file1.md');
      expect(console.log).toHaveBeenCalledWith('✅ /test/file2.md');
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('2 succeeded, 0 failed'));
    });

    it('should display failure results', async () => {
      mockPathResolver.resolvePath.mockReturnValue('/resolved/path');
      const results = [new ConversionResult('/test/file.md', '', false, 'Error message')];
      (mockUseCase.execute as jest.Mock).mockResolvedValue(results);

      await presenter.present(mockUseCase as ConvertMarkdownFolderUseCase, '/test', '/output');

      expect(console.log).toHaveBeenCalledWith('❌ /test/file.md');
      expect(console.log).toHaveBeenCalledWith('   Error: Error message');
    });

    it('should exit with error code when there are failures', async () => {
      mockPathResolver.resolvePath.mockReturnValue('/resolved/path');
      const results = [new ConversionResult('/test/file.md', '', false, 'Error')];
      (mockUseCase.execute as jest.Mock).mockResolvedValue(results);

      await presenter.present(mockUseCase as ConvertMarkdownFolderUseCase, '/test', '/output');

      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle presentation errors', async () => {
      mockPathResolver.resolvePath.mockReturnValue('/resolved/path');
      (mockUseCase.execute as jest.Mock).mockRejectedValue(new Error('Service error'));

      await presenter.present(mockUseCase as ConvertMarkdownFolderUseCase, '/test', '/output');

      expect(console.error).toHaveBeenCalled();
      const call = (console.error as jest.Mock).mock.calls[0][0];
      expect(call).toContain('Error during conversion');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });
});
