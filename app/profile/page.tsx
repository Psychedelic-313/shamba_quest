import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, LogOut, Trophy, Target, Zap, Calendar } from "lucide-react"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user badges
  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("*, badges(*)")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false })

  // Fetch quiz statistics
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("is_correct, xp_earned")
    .eq("user_id", user.id)

  const totalAttempts = attempts?.length || 0;
  const correctAttempts = attempts?.filter((a) => a.is_correct).length || 0;
  // const totalXPEarned = attempts?.reduce((sum, a) => sum + a.xp_earned, 0) || 0;
  const accuracyRate = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

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
          <h1 className="text-xl font-bold">Profile</h1>
          <form action={handleSignOut}>
            <Button variant="ghost" size="sm" className="text-rose-500 p-3" type="submit">
              <LogOut className="h-4 w-4 mr-2 " />
              Sign Out
            </Button>
          </form>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-zinc-100">
                <span className="text-4xl font-bold text-primary">
                  {profile?.display_name?.charAt(0) || "F"}
                </span>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">{profile?.display_name || "Farmer"}</h2>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="text-sm">
                    Level {profile?.current_level}
                  </Badge>
                  <Badge variant="outline" className="text-sm capitalize">
                    {profile?.experience_level || "beginner"}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    Joined {new Date(profile?.created_at || "").toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
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
                  <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                  <p className="text-2xl font-bold">{totalAttempts}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
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
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interests */}
        {profile?.interests && profile.interests.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Learning Interests</CardTitle>
              <CardDescription>Topics you&apos;re interested in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest: string) => (
                  <Badge key={interest} variant="secondary" className="text-sm capitalize">
                    {interest.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>
              {userBadges?.length || 0} badge{userBadges?.length !== 1 ? "s" : ""} earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userBadges && userBadges.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {userBadges.map((userBadge) => {
                  const badge = userBadge.badges
                  return (
                    <div key={userBadge.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="text-4xl bg-primary p-2 rounded-xl">{badge.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Earned {new Date(userBadge.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No badges earned yet. Keep learning to unlock achievements!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
