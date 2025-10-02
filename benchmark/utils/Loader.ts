import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Get the directory name of the current file
 */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Dataset information interface
 */
export interface DatasetInfo {
  name: string
  size: 'small' | 'medium' | 'large' | 'extraLarge' | 'massive'
  filePath: string
  fileSize: number
  lineCount: number
  characterCount: number
  description: string
}

/**
 * Benchmark dataset loader for standardized performance testing
 * @description Loads and manages benchmark datasets with metadata
 */
export class DatasetLoader {
  private readonly datasetDir: string
  private readonly datasets: Map<string, DatasetInfo> = new Map()

  /**
   * Creates a new DatasetLoader instance
   * @param datasetDir - Path to dataset directory (default: './dataset')
   */
  constructor(datasetDir?: string) {
    this.datasetDir = datasetDir ?? path.join(__dirname, '..', 'dataset')
    this.initializeDatasets()
  }

  /**
   * Initialize available datasets with metadata
   */
  private initializeDatasets(): void {
    const datasetConfigs = [
      {
        name: 'small',
        size: 'small' as const,
        description: 'Small document (18.95 KB) - Basic markdown features'
      },
      {
        name: 'medium',
        size: 'medium' as const,
        description: 'Medium document (94.02 KB) - Typical complexity'
      },
      {
        name: 'large',
        size: 'large' as const,
        description: 'Large document (188.57 KB) - Complex structures'
      },
      {
        name: 'extraLarge',
        size: 'extraLarge' as const,
        description: 'Extra large document (382.81 KB) - Stress test'
      },
      {
        name: 'massive',
        size: 'massive' as const,
        description: 'Massive document (8.39 MB) - Extreme performance test'
      }
    ]
    for (const config of datasetConfigs) {
      const filePath = path.join(this.datasetDir, `${config.name}.md`)
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        const content = fs.readFileSync(filePath, 'utf8')
        this.datasets.set(config.name, {
          name: config.name,
          size: config.size,
          filePath,
          fileSize: stats.size,
          lineCount: content.split('\n').length,
          characterCount: content.length,
          description: config.description
        })
      }
    }
  }

  /**
   * Get all available datasets
   * @returns Array of dataset information
   */
  getAvailableDatasets(): DatasetInfo[] {
    return Array.from(this.datasets.values())
  }

  /**
   * Load dataset with metadata
   * @param name - Dataset name
   * @returns Object containing content and metadata
   * @throws Error if dataset not found
   */
  loadDataset(name: string): { content: string; metadata: DatasetInfo } {
    const dataset = this.datasets.get(name)
    if (!dataset) {
      throw new Error(
        `Dataset '${name}' not found. Available: ${Array.from(this.datasets.keys()).join(', ')}`
      )
    }
    const content = fs.readFileSync(dataset.filePath, 'utf8')
    return { content, metadata: dataset }
  }
}

/**
 * Default dataset loader instance
 */
export const datasetLoader = new DatasetLoader()

/**
 * Utility function to load a dataset quickly
 * @param name - Dataset name
 * @returns Dataset content
 */
export function loadDataset(name: string): { content: string; metadata: DatasetInfo } {
  return datasetLoader.loadDataset(name)
}
