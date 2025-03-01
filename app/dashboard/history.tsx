"use client"

import { useEffect, useState } from "react"
import { analysisStorage } from "@/services/analysis-storage"
import type { StoredAnalysis } from "@/types/analysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"

export function AnalysisHistory({ userId }: { userId: string }) {
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([])

  useEffect(() => {
    const loadAnalyses = () => {
      const userAnalyses = analysisStorage.getAnalyses(userId)
      setAnalyses(userAnalyses)
    }

    loadAnalyses()
  }, [userId])

  const handleExport = () => {
    const json = analysisStorage.exportAnalyses(userId)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `jobmatch-analyses-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this analysis?")) {
      await analysisStorage.deleteAnalysis(id)
      setAnalyses(analysisStorage.getAnalyses(userId))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analysis History</h2>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {analyses.map((analysis) => (
          <Card key={analysis.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {analysis.position} at {analysis.company}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(analysis.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysis.score}%</div>
              <p className="text-xs text-muted-foreground">{new Date(analysis.timestamp).toLocaleDateString()}</p>
              <div className="mt-4 space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Matching Skills:</span> {analysis.skills.matching.length}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Missing Skills:</span> {analysis.skills.missing.length}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Interview Readiness:</span> {analysis.interviewReadiness}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

