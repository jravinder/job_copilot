"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, CheckCircle, LinkIcon, Star, Target, XCircle } from "lucide-react"
import type { JobAnalysis } from "@/types/analysis"

// Define default/initial state
const defaultAnalysis: JobAnalysis = {
  id: "",
  userId: "",
  timestamp: new Date().toISOString(),
  version: 1,
  status: "pending",
  scores: {
    overall: 0,
    technicalSkills: 0,
    softSkills: 0,
    experienceMatch: 0,
    cultureFit: 0,
    interviewReadiness: 0,
  },
  position: {
    title: "",
    level: "",
    department: "",
    location: "",
  },
  company: {
    name: "",
  },
  skills: {
    matching: {
      technical: [],
      soft: [],
    },
    missing: {
      technical: [],
      soft: [],
      priority: "medium",
    },
    nice_to_have: [],
  },
  development: {
    courses: [],
    certifications: [],
    projects: [],
  },
  materials: {
    resumeSuggestions: [],
    coverLetter: "",
    coldEmail: "",
    pitches: {
      elevator: "",
      detailed: "",
      technical: "",
    },
  },
  networking: {
    linkedin: {
      profileSuggestions: [],
      connectionStrategy: [],
      contentIdeas: [],
    },
    events: [],
  },
  companyInsights: {
    overview: "",
    recentNews: [],
    culture: {
      values: [],
      environment: "",
      benefits: [],
    },
    growthAreas: [],
    interviewProcess: {
      stages: [],
      focus: [],
      commonQuestions: [],
    },
  },
  interviewPrep: {
    technical: {
      topics: [],
      sampleQuestions: [],
      projectHighlights: [],
    },
    behavioral: {
      stories: [],
      strengthsToHighlight: [],
    },
    questions: {
      toAsk: [],
      toExpect: [],
    },
  },
  metadata: {
    lastModified: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    aiModel: "",
    promptVersion: "1.0",
  },
}

interface EnhancedAnalysisViewProps {
  analysis?: Partial<JobAnalysis>
}

function ScoreCard({
  title,
  score,
  icon: Icon,
  description,
}: { title: string; score: number; icon: any; description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{score}%</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <Progress value={score} className="mt-2" />
      </CardContent>
    </Card>
  )
}

function SkillsCard({
  title,
  skills = [],
  icon: Icon,
  variant,
}: {
  title: string
  skills: string[]
  icon: any
  variant: "success" | "warning"
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              variant={variant === "success" ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <Icon className="h-3 w-3" />
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CourseCard({
  course,
}: {
  course: {
    skill: string
    platform: string
    courseName: string
    url?: string
    duration?: string
    priority: "high" | "medium" | "low"
  }
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{course.courseName}</CardTitle>
        <CardDescription>{course.platform}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{course.skill}</Badge>
          {course.duration && <span className="text-xs text-muted-foreground">{course.duration}</span>}
        </div>
        {course.url && (
          <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-sm font-medium text-primary hover:underline"
          >
            View Course <LinkIcon className="ml-1 h-3 w-3" />
          </a>
        )}
      </CardContent>
    </Card>
  )
}

export function EnhancedAnalysisView({ analysis: partialAnalysis }: EnhancedAnalysisViewProps) {
  // Merge partial analysis with default values
  const analysis = {
    ...defaultAnalysis,
    ...partialAnalysis,
    scores: {
      ...defaultAnalysis.scores,
      ...(partialAnalysis?.scores || {}),
    },
  }

  return (
    <div className="space-y-8">
      {/* Score Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard
          title="Overall Match"
          score={analysis.scores.overall}
          icon={Target}
          description="Match with job requirements"
        />
        <ScoreCard
          title="Technical Skills"
          score={analysis.scores.technicalSkills}
          icon={Brain}
          description="Technical skills alignment"
        />
        <ScoreCard
          title="Interview Ready"
          score={analysis.scores.interviewReadiness}
          icon={Star}
          description="Interview preparation level"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="skills" className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="pitch">Pitches</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <div className="grid gap-4 md:grid-cols-2">
            <SkillsCard
              title="Matching Skills"
              skills={analysis.skills.matching.technical}
              icon={CheckCircle}
              variant="success"
            />
            <SkillsCard
              title="Skills to Develop"
              skills={analysis.skills.missing.technical}
              icon={XCircle}
              variant="warning"
            />
          </div>
        </TabsContent>

        {/* Development Tab */}
        <TabsContent value="development">
          <Card>
            <CardHeader>
              <CardTitle>Learning Path</CardTitle>
              <CardDescription>Recommended courses and certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {analysis.development.courses.map((course, index) => (
                    <CourseCard key={index} course={course} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add remaining tab contents here */}
      </Tabs>
    </div>
  )
}
