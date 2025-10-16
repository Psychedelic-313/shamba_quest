import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Trophy, Zap, Target, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect("/auth/login")
    }

    // Fetch user profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // Fetch user badges count
    const { count: badgesCount } = await supabase
        .from("user_badges")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

    // Fetch recent quiz attempts
    const { data: recentAttempts } = await supabase
        .from("quiz_attempts")
        .select("*, quiz_questions(category)")
        .eq("user_id", user.id)
        .order("attempted_at", { ascending: false })
        .limit(5)

    const correctAttempts = recentAttempts?.filter((attempt) => attempt.is_correct).length || 0;
    const totalAttempts = recentAttempts?.length || 0;
    const accuracyRate = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    // Calculate level progress
    const currentLevelXP = profile?.total_xp || 0;
    const nextLevelXP = (profile?.current_level || 1) * 100;
    const levelProgress = (currentLevelXP / nextLevelXP) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-muted">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-bold text-primary">{profile?.display_name?.charAt(0) || "F"}</span>
                        </div>
                        <div>
                            <h2 className="font-semibold">{profile?.display_name || "Farmer"}</h2>
                            <p className="text-sm text-muted-foreground">Level {profile?.current_level || 1}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/leaderboard">
                            <Button variant="outline" size="sm" className="bg-transparent">
                                Leaderboard
                            </Button>
                        </Link>
                        <Link href="/profile">
                            <Button variant="outline" size="sm" className="bg-transparent">
                                Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total XP</p>
                                    <p className="text-2xl font-bold">{profile?.total_xp || 0}</p>
                                </div>
                                <Zap className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Level</p>
                                    <p className="text-2xl font-bold">{profile?.current_level || 1}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Badges</p>
                                    <p className="text-2xl font-bold">{badgesCount || 0}</p>
                                </div>
                                <Trophy className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Accuracy</p>
                                    <p className="text-2xl font-bold">{accuracyRate}%</p>
                                </div>
                                <Target className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Level Progress */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Level Progress</CardTitle>
                        <CardDescription>
                            {currentLevelXP} / {nextLevelXP} XP to Level {(profile?.current_level || 1) + 1}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={levelProgress} className="h-3" />
                    </CardContent>
                </Card>

                {/* Main Action */}
                <Card className="bg-primary text-primary-foreground border-0 mb-8">
                    <CardContent className="py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Ready for a Challenge?</h2>
                            <p className="opacity-90">Test your knowledge and earn XP with our interactive quizzes</p>
                        </div>
                        <Link href="/quiz">
                            <Button size="lg"
                                variant="secondary"
                                className="text-lg rounded-xl py-4 px-8">
                                Start Quiz
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                {recentAttempts && recentAttempts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your latest quiz attempts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentAttempts.map((attempt) => (
                                    <div key={attempt.id} className="flex items-center justify-between py-2 border-b border-dashed last:border-0">
                                        <div>
                                            <p className="font-medium">{(attempt.quiz_questions)?.category || "Quiz"}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(attempt.attempted_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-sm font-medium ${attempt.is_correct ? "text-primary" : "text-destructive"}`}
                                            >
                                                {attempt.is_correct ? "Correct" : "Incorrect"}
                                            </span>
                                            <span className="text-sm text-muted-foreground">+{attempt.xp_earned} XP</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
