import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import QuizInterface from "@/components/quiz-interface"

export default async function QuizPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile to get experience level
  const { data: profile } = await supabase.from("profiles").select("experience_level").eq("id", user.id).single()

  // Fetch a random question matching user's level
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("difficulty", profile?.experience_level || "beginner")
    .limit(10)

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No questions available at your level.</p>
      </div>
    )
  }

  return (
    <QuizInterface
      questions={questions}
      userId={user.id}
    />
  );
}
