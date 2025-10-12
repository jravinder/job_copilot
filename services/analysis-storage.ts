import type { StoredAnalysis, AnalysisInput, JobAnalysis } from "@/types/analysis"

class AnalysisStorageService {
  private readonly STORAGE_KEY = "jobmatch:analyses"
  private readonly VERSION = 1

  // In-memory cache
  private cache: Map<string, StoredAnalysis> = new Map()

  // Initialize the service
  constructor() {
    this.loadFromLocalStorage()
  }

  // Load analyses from localStorage into cache
  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const analyses: StoredAnalysis[] = JSON.parse(stored)
        analyses.forEach((analysis) => {
          this.cache.set(analysis.id, analysis)
        })
      }
    } catch (error) {
      console.error("Error loading analyses from localStorage:", error)
    }
  }

  // Save cache to localStorage
  private saveToLocalStorage(): void {
    try {
      const analyses = Array.from(this.cache.values())
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(analyses))
    } catch (error) {
      console.error("Error saving analyses to localStorage:", error)
    }
  }

  // Generate a unique ID for new analyses
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Create a new analysis
  async createAnalysis(userId: string, input: AnalysisInput, analysis: JobAnalysis): Promise<StoredAnalysis> {
    const storedAnalysis: StoredAnalysis = {
      ...analysis,
      id: this.generateId(),
      userId,
      input,
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      metadata: {
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    }

    this.cache.set(storedAnalysis.id, storedAnalysis)
    this.saveToLocalStorage()

    // If you have a backend API, you would also save there
    try {
      await this.syncWithServer(storedAnalysis)
    } catch (error) {
      console.error("Error syncing with server:", error)
    }

    return storedAnalysis
  }

  // Get all analyses for a user
  getAnalyses(userId: string): StoredAnalysis[] {
    return Array.from(this.cache.values())
      .filter((analysis) => analysis.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Get a specific analysis
  getAnalysis(id: string): StoredAnalysis | undefined {
    return this.cache.get(id)
  }

  // Update an existing analysis
  async updateAnalysis(
    id: string,
    input: Partial<AnalysisInput>,
    analysis: Partial<JobAnalysis>,
  ): Promise<StoredAnalysis | undefined> {
    const existing = this.cache.get(id)
    if (!existing) return undefined

    const updated: StoredAnalysis = {
      ...existing,
      ...analysis,
      input: {
        ...existing.input,
        ...input,
      },
      metadata: {
        ...existing.metadata,
        lastModified: new Date().toISOString(),
      },
    }

    this.cache.set(id, updated)
    this.saveToLocalStorage()

    // Sync with server
    try {
      await this.syncWithServer(updated)
    } catch (error) {
      console.error("Error syncing with server:", error)
    }

    return updated
  }

  // Delete an analysis
  async deleteAnalysis(id: string): Promise<boolean> {
    const deleted = this.cache.delete(id)
    if (deleted) {
      this.saveToLocalStorage()

      // Sync deletion with server
      try {
        await this.deleteFromServer(id)
      } catch (error) {
        console.error("Error deleting from server:", error)
      }
    }
    return deleted
  }

  // Export analyses to JSON
  exportAnalyses(userId: string): string {
    const analyses = this.getAnalyses(userId)
    return JSON.stringify(analyses, null, 2)
  }

  // Import analyses from JSON
  importAnalyses(userId: string, json: string): boolean {
    try {
      const analyses: StoredAnalysis[] = JSON.parse(json)
      analyses.forEach((analysis) => {
        if (analysis.userId === userId) {
          this.cache.set(analysis.id, analysis)
        }
      })
      this.saveToLocalStorage()
      return true
    } catch (error) {
      console.error("Error importing analyses:", error)
      return false
    }
  }

  // Sync with server (implement this when you have a backend)
  private async syncWithServer(analysis: StoredAnalysis): Promise<void> {
    // TODO: Implement server sync
    // This would typically involve making API calls to your backend
    // Example:
    // await fetch('/api/analyses', {
    //   method: 'POST',
    //   body: JSON.stringify(analysis)
    // })
  }

  // Delete from server
  private async deleteFromServer(id: string): Promise<void> {
    // TODO: Implement server deletion
    // Example:
    // await fetch(`/api/analyses/${id}`, {
    //   method: 'DELETE'
    // })
  }
}

// Create a singleton instance
export const analysisStorage = new AnalysisStorageService()
