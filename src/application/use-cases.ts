import { IConversionService } from '../domain/interfaces';
import { ConversionResult } from '../domain/entities';

/**
 * Use case for converting markdown files in a folder
 */
export class ConvertMarkdownFolderUseCase {
  constructor(private conversionService: IConversionService) {}

  async execute(
    sourceFolderPath: string,
    destinationFolderPath: string
  ): Promise<ConversionResult[]> {
    return this.conversionService.convertFolder(sourceFolderPath, destinationFolderPath);
  }
}
