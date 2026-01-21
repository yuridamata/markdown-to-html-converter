/**
 * Represents a markdown file to be converted
 */
export class MarkdownFile {
  constructor(
    readonly sourcePath: string,
    readonly destinationPath: string,
    readonly relativePath: string
  ) {}
}

/**
 * Represents a conversion result
 */
export class ConversionResult {
  constructor(
    readonly sourcePath: string,
    readonly destinationPath: string,
    readonly success: boolean,
    readonly error?: string
  ) {}
}
