"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useTheme } from "../contexts/ThemeContext"
import { Moon, Sun, BookOpen, Users, BarChart3, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LayoutProps {
  children: React.ReactNode
  userRole?: "educator" | "learner"
}

export default function Layout({ children, userRole = "learner" }: LayoutProps) {
  const { theme, toggleTheme } = useTheme()

  const navItems =
    userRole === "educator"
      ? [
          { icon: BookOpen, label: "Quizzes", href: "/dashboard" },
          { icon: BarChart3, label: "Analytics", href: "/analytics" },
          { icon: Users, label: "Leaderboard", href: "/leaderboard" },
          { icon: Settings, label: "Settings", href: "/settings" },
        ]
      : [
          { icon: BookOpen, label: "Join Quiz", href: "/dashboard" },
          { icon: BarChart3, label: "History", href: "/history" },
          { icon: Users, label: "Leaderboard", href: "/leaderboard" },
          { icon: Settings, label: "Settings", href: "/settings" },
        ]

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-dark-bg text-dark-text" : "bg-light-bg text-light-text"
      }`}
    >
      {/* Navigation Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`border-b transition-colors duration-300 ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  theme === "dark" ? "bg-dark-primary" : "bg-light-primary"
                }`}
              >
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">EduQuiz</span>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-dark-accent hover:bg-gray-800"
                      : "text-gray-600 hover:text-light-accent hover:bg-gray-100"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </motion.a>
              ))}
            </nav>

            {/* Theme Toggle & User Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative">
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === "dark" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </Button>

              <Button variant="ghost" size="icon">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
