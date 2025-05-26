"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Save, ArrowLeft, Clock, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useTheme } from "../contexts/ThemeContext"
import { supabase } from "../lib/supabase"

interface Question {
  id: string
  question_text: string
  options: string[]
  correct_answer: number
  points: number
  time_limit: number
}

interface QuizData {
  title: string
  description: string
  timer_minutes: number
  questions: Question[]
}

export default function QuizBuilder() {
  const { theme } = useTheme()
  const [quiz, setQuiz] = useState<QuizData>({
    title: "",
    description: "",
    timer_minutes: 30,
    questions: [],
  })
  const [saving, setSaving] = useState(false)

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question_text: "",
      options: ["", "", "", ""],
      correct_answer: 0,
      points: 1,
      time_limit: 30,
    }
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
  }

  const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)),
    }))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)) } : q,
      ),
    }))
  }

  const removeQuestion = (questionId: string) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
  }

  const saveQuiz = async () => {
    setSaving(true)
    try {
      // Save quiz to database
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          title: quiz.title,
          description: quiz.description,
          timer_minutes: quiz.timer_minutes,
          creator_id: "temp-user-id", // Replace with actual user ID
          quiz_code: "", // Will be auto-generated
        })
        .select()
        .single()

      if (quizError) throw quizError

      // Save questions
      const questionsToInsert = quiz.questions.map((q, index) => ({
        quiz_id: quizData.id,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        points: q.points,
        time_limit: q.time_limit,
        order_index: index,
      }))

      const { error: questionsError } = await supabase.from("questions").insert(questionsToInsert)

      if (questionsError) throw questionsError

      // Success - redirect or show success message
      console.log("Quiz saved successfully!")
    } catch (error) {
      console.error("Error saving quiz:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Quiz Builder</h1>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Create an engaging quiz for your students
            </p>
          </div>
        </div>
        <Button
          onClick={saveQuiz}
          disabled={saving || !quiz.title || quiz.questions.length === 0}
          className={`${
            theme === "dark" ? "bg-dark-primary hover:bg-blue-600" : "bg-light-primary hover:bg-blue-600"
          } text-white`}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Quiz"}
        </Button>
      </motion.div>

      {/* Quiz Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle>Quiz Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  placeholder="Enter quiz title..."
                  value={quiz.title}
                  onChange={(e) => setQuiz((prev) => ({ ...prev, title: e.target.value }))}
                  className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timer">Time Limit (minutes)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="timer"
                    type="number"
                    min="1"
                    max="180"
                    value={quiz.timer_minutes}
                    onChange={(e) =>
                      setQuiz((prev) => ({ ...prev, timer_minutes: Number.parseInt(e.target.value) || 30 }))
                    }
                    className={`pl-10 ${theme === "dark" ? "bg-gray-700 border-gray-600" : ""}`}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what this quiz covers..."
                value={quiz.description}
                onChange={(e) => setQuiz((prev) => ({ ...prev, description: e.target.value }))}
                className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Questions ({quiz.questions.length})</h2>
          <Button
            onClick={addQuestion}
            variant="outline"
            className={`${
              theme === "dark"
                ? "border-dark-primary text-dark-primary hover:bg-dark-primary hover:text-white"
                : "border-light-primary text-light-primary hover:bg-light-primary hover:text-white"
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        <AnimatePresence>
          {quiz.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Hash className="w-5 h-5" />
                      <span>Question {index + 1}</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Textarea
                      placeholder="Enter your question..."
                      value={question.question_text}
                      onChange={(e) => updateQuestion(question.id, "question_text", e.target.value)}
                      className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correct_answer === optionIndex}
                            onChange={() => updateQuestion(question.id, "correct_answer", optionIndex)}
                            className={`${theme === "dark" ? "text-dark-accent" : "text-light-accent"}`}
                          />
                          <span>Option {String.fromCharCode(65 + optionIndex)}</span>
                          {question.correct_answer === optionIndex && (
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                theme === "dark" ? "bg-dark-accent text-white" : "bg-light-accent text-white"
                              }`}
                            >
                              Correct
                            </span>
                          )}
                        </Label>
                        <Input
                          placeholder={`Enter option ${String.fromCharCode(65 + optionIndex)}...`}
                          value={option}
                          onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                          className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Points</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={question.points}
                        onChange={(e) => updateQuestion(question.id, "points", Number.parseInt(e.target.value) || 1)}
                        className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time Limit (seconds)</Label>
                      <Input
                        type="number"
                        min="10"
                        max="300"
                        value={question.time_limit}
                        onChange={(e) =>
                          updateQuestion(question.id, "time_limit", Number.parseInt(e.target.value) || 30)
                        }
                        className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {quiz.questions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Hash className={`mx-auto h-12 w-12 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
            <h3 className="mt-4 text-lg font-medium">No questions yet</h3>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Add your first question to get started
            </p>
            <Button onClick={addQuestion} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Question
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
