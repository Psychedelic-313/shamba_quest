import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sprout, Trophy, Users, Zap } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-8">
          <div className="flex items-center gap-3">
            <Sprout className="h-12 w-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold text-balance">ShambaQuest</h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl text-balance">
            Master climate-smart agriculture through gamified learning. Earn XP, unlock badges, and become a farming
            champion!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild
              size="lg"
              variant="default"
              className="text-lg rounded-2xl">
              <Link href="/auth/sign-up">Start Your Journey</Link>
            </Button>
            <Button asChild
              size="lg"
              variant="outline"
              className="text-lg bg-transparent rounded-2xl">
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why ShambaQuest?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="ring-5 ring-zinc-100 transition-colors">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Interactive Quizzes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Answer questions about climate-smart farming and get instant AI-powered feedback
              </p>
            </CardContent>
          </Card>

          <Card className="ring-5 ring-zinc-100 transition-colors">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Earn Rewards</h3>
              <p className="text-muted-foreground leading-relaxed">
                Collect XP points and unlock achievement badges as you progress through your learning journey
              </p>
            </CardContent>
          </Card>

          <Card className="ring-5 ring-zinc-100 transition-colors">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Compete & Learn</h3>
              <p className="text-muted-foreground leading-relaxed">
                Climb the leaderboard and see how you rank against other young farmers across Kenya
              </p>
            </CardContent>
          </Card>

          <Card className="ring-5 ring-zinc-100 transition-colors">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sprout className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Real-World Skills</h3>
              <p className="text-muted-foreground leading-relaxed">
                Learn practical techniques for sustainable farming that you can apply on your shamba
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 mb-16">
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="py-12 flex flex-col items-center text-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Become a Climate Champion?</h2>
            <p className="text-lg max-w-2xl text-balance opacity-90">
              Join thousands of young Kenyan farmers learning sustainable agriculture practices through fun, interactive
              quizzes
            </p>
            <Button asChild
              size="lg"
              variant="secondary"
              className="text-lg rounded-2xl"
            >
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

    </main>
  );
}
