"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "../contexts/ThemeContext"
import { supabase, type Question } from "../lib/supabase"

interface QuizPlayerProps {
  quizId: string
  questions: Question[]
}

export default function QuizPlayer({ quizId, questions }: QuizPlayerProps) {
  const { theme } = useTheme()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  useEffect(() => {
    if (currentQuestion) {
      setQuestionTimeRemaining(currentQuestion.time_limit)
    }
  }, [currentQuestion])

  useEffect(() => {
    if (questionTimeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setQuestionTimeRemaining((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (questionTimeRemaining === 0 && !isCompleted) {
      handleNextQuestion()
    }
  }, [questionTimeRemaining, isCompleted])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = async () => {
    setIsCompleted(true)

    // Calculate score
    let totalScore = 0
    questions.forEach((question) => {
      const selectedAnswer = selectedAnswers[question.id]
      if (selectedAnswer === question.correct_answer) {
        totalScore += question.points
      }
    })
    setScore(totalScore)

    // Save results to database
    try {
      // Create quiz attempt
      const { data: attemptData, error: attemptError } = await supabase
        .from("quiz_attempts")
        .insert({
          quiz_id: quizId,
          user_id: "temp-user-id", // Replace with actual user ID
          completed_at: new Date().toISOString(),
          is_completed: true,
          time_taken: 0, // Calculate actual time taken
        })
        .select()
        .single()

      if (attemptError) throw attemptError

      // Save individual responses
      const responses = questions.map((question) => ({
        attempt_id: attemptData.id,
        question_id: question.id,
        selected_answer: selectedAnswers[question.id] ?? null,
        is_correct: selectedAnswers[question.id] === question.correct_answer,
        time_taken: question.time_limit - questionTimeRemaining,
      }))

      const { error: responsesError } = await supabase.from("responses").insert(responses)

      if (responsesError) throw responsesError

      // Save final score
      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
      const { error: scoreError } = await supabase.from("scores").insert({
        quiz_id: quizId,
        user_id: "temp-user-id", // Replace with actual user ID
        attempt_id: attemptData.id,
        score: totalScore,
        total_points: totalPoints,
        percentage: (totalScore / totalPoints) * 100,
        time_taken: 0, // Calculate actual time taken
      })

      if (scoreError) throw scoreError
    } catch (error) {
      console.error("Error saving quiz results:", error)
    }
  }

  if (isCompleted) {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
    const percentage = (score / totalPoints) * 100

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center space-y-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className={`mx-auto h-24 w-24 ${theme === "dark" ? "text-dark-accent" : "text-light-accent"}`} />
        </motion.div>

        <div>
          <h1 className="text-4xl font-bold mb-4">Quiz Completed!</h1>
          <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Great job! Here are your results:
          </p>
        </div>

        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{score}</div>
                <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Points Scored</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{totalPoints}</div>
                <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Total Points</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{percentage.toFixed(1)}%</div>
                <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Percentage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button variant="outline">View Leaderboard</Button>
          <Button
            className={`${
              theme === "dark" ? "bg-dark-primary hover:bg-blue-600" : "bg-light-primary hover:bg-blue-600"
            } text-white`}
          >
            Take Another Quiz
          </Button>
        </div>
      </motion.div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz not found</h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            The quiz you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className={`text-sm font-medium ${questionTimeRemaining <= 10 ? "text-red-500" : ""}`}>
                {questionTimeRemaining}s
              </span>
            </div>
          </div>
        </div>
        <Progress value={progress} className={`h-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">{currentQuestion.question_text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswers[currentQuestion.id] === index
                        ? theme === "dark"
                          ? "border-dark-primary bg-dark-primary/10"
                          : "border-light-primary bg-light-primary/10"
                        : theme === "dark"
                          ? "border-gray-600 hover:border-gray-500"
                          : "border-gray-200 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[currentQuestion.id] === index
                            ? theme === "dark"
                              ? "border-dark-primary bg-dark-primary text-white"
                              : "border-light-primary bg-light-primary text-white"
                            : theme === "dark"
                              ? "border-gray-500"
                              : "border-gray-300"
                        }`}
                      >
                        <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-6">
                <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Worth {currentQuestion.points} point{currentQuestion.points !== 1 ? "s" : ""}
                </div>
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestion.id] === undefined}
                  className={`${
                    theme === "dark" ? "bg-dark-primary hover:bg-blue-600" : "bg-light-primary hover:bg-blue-600"
                  } text-white`}
                >
                  {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
