import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Trophy, Medal, Award } from "lucide-react"

export default async function LeaderboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/auth/login")
    }

    // Fetch top 50 users by XP
    const { data: topUsers } = await supabase
        .from("profiles")
        .select("id, display_name, total_xp, current_level")
        .order("total_xp", { ascending: false })
        .limit(50)

    // Find current rank
    const userRank = topUsers?.findIndex((u) => u.id === user.id) ?? -1

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
                    <h1 className="text-xl font-bold">Leaderboard</h1>
                    <div className="w-24" />
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* User's Rank Card */}
                {userRank >= 0 && (
                    <Card className="mb-8 border-2 border-primary">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-xl font-bold text-primary">#{userRank + 1}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Your Rank</p>
                                        <p className="text-sm text-muted-foreground">
                                            {topUsers?.[userRank]?.total_xp || 0} XP • Level {topUsers?.[userRank]?.current_level || 1}
                                        </p>
                                    </div>
                                </div>
                                <Trophy className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Leaderboard */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Top Farmers</CardTitle>
                        <CardDescription>The highest-scoring climate champions in Kenya</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {topUsers?.map((profile, index) => {
                                const isCurrentUser = profile.id === user.id
                                const rankIcon =
                                    index === 0 ? (
                                        <Trophy className="h-6 w-6 text-yellow-500" />
                                    ) : index === 1 ? (
                                        <Medal className="h-6 w-6 text-gray-400" />
                                    ) : index === 2 ? (
                                        <Award className="h-6 w-6 text-amber-600" />
                                    ) : null

                                return (
                                    <div
                                        key={profile.id}
                                        className={`flex items-center justify-between p-4 rounded-lg transition-colors ${isCurrentUser ? "bg-primary/10 border-2 border-primary" : "bg-muted/50 hover:bg-muted"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 text-center">
                                                {rankIcon || <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>}
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="font-bold text-primary">{profile.display_name?.charAt(0) || "F"}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">
                                                    {profile.display_name || "Farmer"}
                                                    {isCurrentUser && <span className="text-primary ml-2">(You)</span>}
                                                </p>
                                                <p className="text-sm text-muted-foreground">Level {profile.current_level}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">{profile.total_xp}</p>
                                            <p className="text-xs text-muted-foreground">XP</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
