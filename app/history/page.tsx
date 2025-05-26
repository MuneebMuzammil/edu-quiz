"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockHistory = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    score: 85,
    totalQuestions: 15,
    timeSpent: "4:32",
    completedAt: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    title: "React Components",
    score: 92,
    totalQuestions: 12,
    timeSpent: "3:45",
    completedAt: "2024-01-14",
    status: "completed",
  },
  {
    id: "3",
    title: "CSS Grid & Flexbox",
    score: 78,
    totalQuestions: 10,
    timeSpent: "5:12",
    completedAt: "2024-01-13",
    status: "completed",
  },
]

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz History</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Review your past quiz attempts and performance</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {mockHistory.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{quiz.completedAt}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.timeSpent}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-6">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.score}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.round((quiz.score / 100) * quiz.totalQuestions)}/{quiz.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
                    </div>
                  </div>
                  <div className="w-24 h-24 relative">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200 dark:text-gray-700"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600 dark:text-blue-400"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${quiz.score}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{quiz.score}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
