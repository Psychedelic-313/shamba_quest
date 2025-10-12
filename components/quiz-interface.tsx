"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  question: string
  correct_answer: string
  difficulty: string
  category: string
  xp_reward: number
}

interface QuizInterfaceProps {
  questions: Question[]
  userId: string
}

export default function QuizInterface({ questions, userId }: QuizInterfaceProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userAnswer.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          userAnswer: userAnswer.trim(),
          correctAnswer: currentQuestion.correct_answer,
          userId,
          xpReward: currentQuestion.xp_reward,
        }),
      })

      const result = await response.json()

      const params = new URLSearchParams({
        attemptId: result.attemptId,
        isCorrect: result.isCorrect.toString(),
        xpEarned: result.xpEarned.toString(),
      })

      if (result.newBadges && result.newBadges.length > 0) {
        params.append("newBadges", result.newBadges.join(","))
      }

      if (result.leveledUp) {
        params.append("leveledUp", "true")
        params.append("newLevel", result.newLevel.toString())
      }

      router.push(`/quiz/feedback?${params.toString()}`)
    } catch (error) {
      console.error("[v0] Error submitting answer:", error)
      alert("Failed to submit answer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {currentQuestion.category}
              </span>
              <span className="text-sm text-muted-foreground capitalize">{currentQuestion.difficulty}</span>
            </div>
            <CardTitle className="text-2xl leading-relaxed">{currentQuestion.question}</CardTitle>
            <CardDescription>Write your answer below. Be as detailed as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <Textarea
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={6}
                  className="resize-none"
                  disabled={isSubmitting}
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Reward: +{currentQuestion.xp_reward} XP</p>
                  <Button type="submit" size="lg" disabled={!userAnswer.trim() || isSubmitting}>
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Submit Answer
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
