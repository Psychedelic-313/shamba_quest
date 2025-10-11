import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkAndAwardBadges, calculateLevel } from "@/lib/gamification"

// Simple AI evaluation function (simulated)
async function evaluateAnswer(
  userAnswer: string,
  correctAnswer: string,
): Promise<{ isCorrect: boolean; feedback: string }> {
  const normalizedUser = userAnswer.toLowerCase().trim()
  const normalizedCorrect = correctAnswer.toLowerCase().trim()

  const correctKeywords = normalizedCorrect.split(" ").filter((word) => word.length > 3)
  const matchedKeywords = correctKeywords.filter((keyword) => normalizedUser.includes(keyword))

  const matchPercentage = (matchedKeywords.length / correctKeywords.length) * 100
  const isCorrect = matchPercentage >= 50

  let feedback = ""
  if (isCorrect) {
    feedback = `Great job! Your answer demonstrates a good understanding of the concept. You correctly identified key points about ${matchedKeywords.slice(0, 2).join(" and ")}. Keep up the excellent work!`
  } else {
    feedback = `Good effort! However, your answer could be improved. The correct answer focuses on: ${correctAnswer}. Try to include more specific details about the topic in your response. Don't give up - learning is a journey!`
  }

  return { isCorrect, feedback }
}

export async function POST(request: Request) {
  try {
    const { questionId, userAnswer, correctAnswer, userId, xpReward } = await request.json()

    const supabase = await createClient()

    const { isCorrect, feedback } = await evaluateAnswer(userAnswer, correctAnswer)

    const xpEarned = isCorrect ? xpReward : Math.floor(xpReward * 0.3)

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("total_xp, current_level")
      .eq("id", userId)
      .single()

    const oldTotalXP = profile?.total_xp || 0
    const newTotalXP = oldTotalXP + xpEarned
    const newLevel = calculateLevel(newTotalXP)

    await supabase
      .from("profiles")
      .update({
        total_xp: newTotalXP,
        current_level: newLevel,
      })
      .eq("id", userId)

    const newBadges = await checkAndAwardBadges(supabase, userId, newTotalXP)

    const leveledUp = newLevel > (profile?.current_level || 1)

    return NextResponse.json({
      attemptId: attempt.id,
      isCorrect,
      xpEarned,
      feedback,
      newBadges,
      leveledUp,
      newLevel,
    })
  } catch (error) {
    console.error("Error in quiz submission:", error)
    return NextResponse.json({ error: "Failed to submit quiz answer" }, { status: 500 })
  }
}
