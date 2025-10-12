import { CheckCircle } from "lucide-react"
import Link from "next/link"

export type Step = {
  id: string
  label: string
  href: string
  description?: string
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: string
  completedSteps: string[]
}

export function ProgressSteps({ steps, currentStep, completedSteps }: ProgressStepsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        {/* Timeline track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

        {/* Timeline steps */}
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = completedSteps.includes(step.id)
            const stepNumber = index + 1

            return (
              <Link
                key={step.id}
                href={step.href}
                className="flex flex-col items-center"
                aria-current={isActive ? "step" : undefined}
              >
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-1 md:mb-2 border-2 ${
                    isActive
                      ? "bg-blue-600 border-blue-600 text-white"
                      : isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-slate-300 text-slate-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <span className="text-sm md:text-base font-semibold">{stepNumber}</span>
                  )}
                </div>
                <span className={`text-xs md:text-sm font-medium ${isActive ? "text-blue-600" : "text-slate-600"}`}>
                  {step.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Progress indicators */}
        <div className="absolute top-1/2 left-0 right-0 flex -translate-y-1/2 z-0">
          {steps.slice(0, -1).map((step, index) => {
            const nextStepId = steps[index + 1].id
            const isCompleted =
              completedSteps.includes(step.id) || currentStep === nextStepId || completedSteps.includes(nextStepId)

            return (
              <div
                key={`progress-${step.id}`}
                className={`h-1 flex-1 ${isCompleted ? "bg-blue-600" : "bg-slate-200"}`}
              ></div>
            )
          })}
        </div>
      </div>

      {/* Step description */}
      <div className="mt-2 md:mt-4 text-center">
        {steps.map(
          (step) =>
            step.id === currentStep &&
            step.description && (
              <p key={`desc-${step.id}`} className="text-xs md:text-sm text-slate-600">
                {step.description}
              </p>
            ),
        )}
      </div>
    </div>
  )
}
