"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"
import { ProgressCircle } from "./ui/progress-circle"

interface Question {
  id: string
  question: string
  correct_answer: string
  xp_reward: number
  difficulty: string
}

interface QuizInterfaceProps {
  questions: Question[]
  userId: string
}

export default function QuizInterface({ questions, userId }: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [feedbackData, setFeedbackData] = useState<{
    isCorrect: boolean
    ai_feedback: string
    correctAnswer: string
    xpEarned: number
  } | null>(null)
  const [finished, setFinished] = useState(false)

  const currentQuestion = questions[currentIndex]

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          userId,
          userAnswer,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Submission failed")

      setFeedbackData({
        isCorrect: data.isCorrect,
        ai_feedback: data.ai_feedback,
        correctAnswer: data.correctAnswer,
        xpEarned: data.xpEarned,
      })
    } catch (error) {
      console.error("Quiz submission error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setUserAnswer("")
      setFeedbackData(null)
      setCurrentIndex((prev) => prev + 1)
    } else {
      setFinished(true)
    }
  }

  if (finished) {
    return (
      <motion.div
        className="min-h-[60vh] flex flex-col items-center justify-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">You&apos;ve completed this quiz!</h2>
        <p className="text-muted-foreground mb-6">Great job — keep practicing to earn more XP and badges.</p>
        <Button onClick={() => window.location.reload()}>Restart Quiz</Button>
      </motion.div>
    )
  }

  const quizProgress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-muted">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mx-auto flex justify-center items-center ">
          <Card className="w-full max-w-2xl shadow-lg border-zinc-200 ring-5 ring-zinc-100">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex justify-between">
                <div className="flex items-center justify-center gap-x-5">
                  <ProgressCircle value={quizProgress}>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      {Math.round(quizProgress)}%
                    </span>
                  </ProgressCircle>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      Quiz Progress
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Keep going! You&apos;re doing great.
                    </p>
                  </div>
                </div>
                <span className="text-muted-foreground text-sm capitalize">{currentQuestion.difficulty}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {!feedbackData ? (
                  <motion.div
                    key={`question-${currentIndex}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="mb-6 text-lg leading-relaxed">{currentQuestion.question}</p>
                    <Textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="min-h-[120px]"
                    />
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleSubmit}
                        disabled={loading || !userAnswer.trim()}
                        className="flex items-center gap-2"
                      >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Submit
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`feedback-${currentIndex}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {feedbackData.isCorrect ? (
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-500" />
                      )}
                      <h3 className="text-xl font-bold">
                        {feedbackData.isCorrect ? "Correct!" : "Not Quite"}
                      </h3>
                    </div>

                    <p className="text-muted-foreground mb-2">
                      You earned <strong>{feedbackData.xpEarned} XP</strong>
                    </p>

                    <div className="p-4 mb-4 rounded-lg bg-accent/10 border border-accent">
                      <p className="leading-relaxed">{feedbackData.ai_feedback}</p>
                    </div>

                    {!feedbackData.isCorrect && (
                      <div className="p-4 mb-4 rounded-lg bg-muted/30 border border-border">
                        <p className="font-semibold mb-1">Correct Answer:</p>
                        <p className="leading-relaxed">{feedbackData.correctAnswer}</p>
                      </div>
                    )}

                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleNext} className="flex items-center gap-2">
                        Next Question
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
