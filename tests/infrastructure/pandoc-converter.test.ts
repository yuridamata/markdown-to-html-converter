import { PandocMarkdownConverter } from '../../src/infrastructure/pandoc-converter';
import { execFile } from 'child_process';

jest.mock('child_process');

describe('PandocMarkdownConverter', () => {
  let converter: PandocMarkdownConverter;
  const mockExecFile = execFile as jest.MockedFunction<typeof execFile>;

  beforeEach(() => {
    converter = new PandocMarkdownConverter();
    jest.clearAllMocks();
  });

  describe('convert', () => {
    it('should call pandoc with correct arguments', async () => {
      (mockExecFile as any).mockImplementation((_cmd: string, _args: any, callback: Function) => {
        callback(null);
        return {} as any;
      });

      await converter.convert('/test/input.md', '/test/output.rtf');

      expect(mockExecFile).toHaveBeenCalledWith(
        'pandoc',
        ['/test/input.md', '-t', 'rtf', '-o', '/test/output.rtf'],
        expect.any(Function)
      );
    });

    it('should throw error when pandoc fails', async () => {
      const error = new Error('Pandoc not found');
      (mockExecFile as any).mockImplementation((_cmd: string, _args: any, callback: Function) => {
        callback(error);
        return {} as any;
      });

      await expect(converter.convert('/test/input.md', '/test/output.rtf')).rejects.toThrow(
        'Failed to convert /test/input.md: Pandoc not found'
      );
    });

    it('should handle conversion errors gracefully', async () => {
      const error = new Error('Conversion failed');
      (mockExecFile as any).mockImplementation((_cmd: string, _args: any, callback: Function) => {
        callback(error);
        return {} as any;
      });

      await expect(converter.convert('/test/input.md', '/test/output.rtf')).rejects.toThrow();
    });
  });
});
