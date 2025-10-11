import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle2, XCircle, Lightbulb, Home, Trophy, TrendingUp } from "lucide-react"

export default async function FeedbackPage({
    searchParams,
}: {
    searchParams: {
        attemptId: string
        isCorrect: string
        xpEarned: string
        newBadges?: string
        leveledUp?: string
        newLevel?: string
    }
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/auth/login")
    }

    const { attemptId, isCorrect, xpEarned, newBadges, leveledUp, newLevel } = await searchParams
    const isAnswerCorrect = isCorrect === "true"
    const hasLeveledUp = leveledUp === "true"
    const earnedBadges = newBadges ? newBadges.split(",") : []

    const { data: attempt } = await supabase
        .from("quiz_attempts")
        .select("*, quiz_questions(*)")
        .eq("id", attemptId)
        .single()

    if (!attempt) {
        redirect("/dashboard")
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Level Up Notification */}
                {hasLeveledUp && (
                    <Card className="mb-6 border-2 border-secondary bg-secondary/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                                    <TrendingUp className="h-10 w-10 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Level Up!</h3>
                                    <p className="text-muted-foreground">You&apos;ve reached Level {newLevel}!</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* New Badges Notification */}
                {earnedBadges.length > 0 && (
                    <Card className="mb-6 border-2 border-accent bg-accent/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                                    <Trophy className="h-10 w-10 text-accent-foreground" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2">New Badge{earnedBadges.length > 1 ? "s" : ""} Earned!</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {earnedBadges.map((badge) => (
                                            <Badge key={badge} variant="secondary" className="text-sm">
                                                {badge}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Result Card */}
                <Card className={`mb-6 border-2 ${isAnswerCorrect ? "border-primary" : "border-destructive"}`}>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            {isAnswerCorrect ? (
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-10 w-10 text-primary" />
                                </div>
                            ) : (
                                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                    <XCircle className="h-10 w-10 text-destructive" />
                                </div>
                            )}
                            <div>
                                <CardTitle className="text-3xl">{isAnswerCorrect ? "Correct!" : "Not Quite"}</CardTitle>
                                <p className="text-lg text-muted-foreground mt-1">You earned {xpEarned} XP</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Question Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Question</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg leading-relaxed">{(attempt.quiz_questions)?.question}</p>
                    </CardContent>
                </Card>

                {/* Your Answer */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Your Answer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-relaxed">{attempt.user_answer}</p>
                    </CardContent>
                </Card>

                {/* AI Feedback */}
                <Card className="mb-6 bg-accent/10 border-accent">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-accent-foreground" />
                            <CardTitle className="text-xl">AI Feedback</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-relaxed">{attempt.ai_feedback}</p>
                    </CardContent>
                </Card>

                {/* Correct Answer (if incorrect) */}
                {!isAnswerCorrect && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-xl">Correct Answer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed">{(attempt.quiz_questions)?.correct_answer}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="flex-1">
                        <Link href="/quiz">Try Another Question</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="flex-1 bg-transparent">
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
