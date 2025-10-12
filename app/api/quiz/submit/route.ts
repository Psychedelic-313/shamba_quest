import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { awardEligibleBadges, calculateLevel } from "@/lib/gamification"

// Simple AI evaluation function
async function evaluateAnswer(
  userAnswer: string,
  correctAnswer: string
): Promise<{ isCorrect: boolean; feedback: string }> {
  const normalizedUser = userAnswer.toLowerCase().trim()
  const normalizedCorrect = correctAnswer.toLowerCase().trim()

  const correctKeywords = normalizedCorrect.split(" ").filter((word) => word.length > 3)
  const matchedKeywords = correctKeywords.filter((keyword) => normalizedUser.includes(keyword))

  const matchPercentage = (matchedKeywords.length / correctKeywords.length) * 100
  const isCorrect = matchPercentage >= 50

  const feedback = isCorrect
    ? `Great job! Your answer demonstrates a solid understanding of the topic. You identified key points like ${matchedKeywords.slice(0, 2).join(" and ")}. Keep it up!`
    : `Good effort! The correct answer is: ${correctAnswer}. Try to include those key details next time — you're learning fast!`

  return { isCorrect, feedback }
}

export async function POST(request: Request) {
  try {
    const { questionId, userId, userAnswer } = await request.json()
    const supabase = await createClient()

    // Fetch the question details directly from Supabase
    const { data: question, error: questionError } = await supabase
      .from("quiz_questions")
      .select("id, correct_answer, xp_reward")
      .eq("id", questionId)
      .single()

    if (questionError || !question) {
      throw new Error("Question not found")
    }

    const { isCorrect, feedback } = await evaluateAnswer(userAnswer, question.correct_answer)
    const xpEarned = isCorrect ? question.xp_reward : Math.floor(question.xp_reward * 0.3)

    // Record the attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .insert({
        user_id: userId,
        question_id: questionId,
        user_answer: userAnswer,
        is_correct: isCorrect,
        xp_earned: xpEarned,
        ai_feedback: feedback,
      })
      .select()
      .single()

    if (attemptError) throw attemptError

    // Fetch and update profile XP + level
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_xp, current_level")
      .eq("id", userId)
      .single()

    const oldTotalXP = profile?.total_xp || 0
    const newTotalXP = oldTotalXP + xpEarned
    const newLevel = calculateLevel(newTotalXP)
    const leveledUp = newLevel > (profile?.current_level || 1)

    await supabase
      .from("profiles")
      .update({
        total_xp: newTotalXP,
        current_level: newLevel,
      })
      .eq("id", userId)

    // Check for new badges
    const newBadges = await awardEligibleBadges(supabase, userId, newTotalXP)

    // Respond to the client
    return NextResponse.json({
      attemptId: attempt.id,
      isCorrect,
      xpEarned,
      ai_feedback: feedback,
      correctAnswer: question.correct_answer,
      newBadges,
      leveledUp,
      newLevel,
    })
  } catch (error) {
    console.error("Error in quiz submission:", error)
    return NextResponse.json(
      { error: "Failed to submit quiz answer" },
      { status: 500 }
    )
  }
}
