// Extracted evaluator so it can be mocked independently in tests
export async function evaluateAnswer(
  userAnswer: string,
  correctAnswer: string,
): Promise<{ isCorrect: boolean; feedback: string }> {
  const normalizedUser = userAnswer.toLowerCase().trim()
  const normalizedCorrect = correctAnswer.toLowerCase().trim()

  const correctKeywords = normalizedCorrect.split(' ').filter((word) => word.length > 3)
  const matchedKeywords = correctKeywords.filter((keyword) => normalizedUser.includes(keyword))

  const matchPercentage = (matchedKeywords.length / correctKeywords.length) * 100
  const isCorrect = matchPercentage >= 50

  let feedback = ''
  if (isCorrect) {
    feedback = `Great job! Your answer demonstrates a good understanding of the concept. You correctly identified key points about ${matchedKeywords
      .slice(0, 2)
      .join(' and ')}. Keep up the excellent work!`
  } else {
    feedback = `Good effort! However, your answer could be improved. The correct answer focuses on: ${correctAnswer}. Try to include more specific details about the topic in your response. Don't give up - learning is a journey!`
  }

  return { isCorrect, feedback }
}
