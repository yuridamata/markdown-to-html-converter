import { ConvertMarkdownFolderUseCase } from '../application/use-cases';
import { IPathResolver } from '../domain/interfaces';

/**
 * CLI Presenter - handles user interface and output
 */
export class CliPresenter {
  constructor(private pathResolver: IPathResolver) {}

  async present(
    useCase: ConvertMarkdownFolderUseCase,
    sourceFolder: string,
    destinationFolder: string
  ): Promise<void> {
    const resolvedSourcePath = this.pathResolver.resolvePath(sourceFolder);
    const resolvedDestPath = this.pathResolver.resolvePath(destinationFolder);

    console.log('🔄 Converting Markdown files to HTML...\n');
    console.log(`📁 Source folder: ${resolvedSourcePath}`);
    console.log(`📁 Destination folder: ${resolvedDestPath}\n`);

    try {
      const results = await useCase.execute(resolvedSourcePath, resolvedDestPath);

      if (results.length === 0) {
        console.log('⚠️  No markdown files found in the source folder.');
        return;
      }

      console.log(`Processing ${results.length} file(s):\n`);

      let successCount = 0;
      let failureCount = 0;

      for (const result of results) {
        if (result.success) {
          console.log(`✅ ${result.sourcePath}`);
          successCount++;
        } else {
          console.log(`❌ ${result.sourcePath}`);
          console.log(`   Error: ${result.error}`);
          failureCount++;
        }
      }

      console.log(`\n📊 Conversion complete: ${successCount} succeeded, ${failureCount} failed`);

      if (failureCount > 0) {
        process.exit(1);
      }
    } catch (error) {
      console.error(
        '❌ Error during conversion:',
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  }
}
