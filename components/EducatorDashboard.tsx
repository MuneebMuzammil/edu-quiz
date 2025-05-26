"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Play, Pause, Users, BarChart3, Copy, Eye, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "../contexts/ThemeContext"
import { supabase, type Quiz } from "../lib/supabase"

export default function EducatorDashboard() {
  const { theme } = useTheme()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setQuizzes(data || [])
    } catch (error) {
      console.error("Error fetching quizzes:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleQuizStatus = async (quizId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("quizzes").update({ is_active: !isActive }).eq("id", quizId)

      if (error) throw error
      fetchQuizzes()
    } catch (error) {
      console.error("Error updating quiz status:", error)
    }
  }

  const copyQuizCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // You could add a toast notification here
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className={`w-8 h-8 border-2 border-t-transparent rounded-full ${
            theme === "dark" ? "border-dark-primary" : "border-light-primary"
          }`}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold">Educator Dashboard</h1>
          <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Create and manage your quizzes
          </p>
        </div>
        <Button
          className={`${
            theme === "dark" ? "bg-dark-primary hover:bg-blue-600" : "bg-light-primary hover:bg-blue-600"
          } text-white`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <BarChart3 className={`h-4 w-4 ${theme === "dark" ? "text-dark-accent" : "text-light-accent"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.length}</div>
            <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>+2 from last month</p>
          </CardContent>
        </Card>

        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Quizzes</CardTitle>
            <Play className={`h-4 w-4 ${theme === "dark" ? "text-dark-accent" : "text-light-accent"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.filter((q) => q.is_active).length}</div>
            <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Currently running</p>
          </CardContent>
        </Card>

        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className={`h-4 w-4 ${theme === "dark" ? "text-dark-accent" : "text-light-accent"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>+180 this week</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quizzes Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card
              className={`h-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 hover:border-dark-primary"
                  : "bg-white hover:border-light-primary hover:shadow-lg"
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{quiz.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {quiz.description || "No description provided"}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={quiz.is_active ? "default" : "secondary"}
                    className={quiz.is_active ? (theme === "dark" ? "bg-dark-accent" : "bg-light-accent") : ""}
                  >
                    {quiz.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Quiz Code:</span>
                  <div className="flex items-center space-x-2">
                    <code
                      className={`px-2 py-1 rounded text-sm font-mono ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      {quiz.quiz_code}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyQuizCode(quiz.quiz_code)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Duration:</span>
                  <span>{quiz.timer_minutes} minutes</span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleQuizStatus(quiz.id, quiz.is_active)}
                  >
                    {quiz.is_active ? (
                      <>
                        <Pause className="w-3 h-3 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {quizzes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <BookOpen className={`mx-auto h-12 w-12 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
          <h3 className="mt-4 text-lg font-medium">No quizzes yet</h3>
          <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Get started by creating your first quiz
          </p>
          <Button className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Quiz
          </Button>
        </motion.div>
      )}
    </div>
  )
}
