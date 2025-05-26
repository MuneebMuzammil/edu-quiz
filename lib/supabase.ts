import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Types for our database
export interface User {
  id: string
  clerk_user_id: string
  email: string
  name: string
  role: "educator" | "learner"
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  title: string
  description?: string
  creator_id: string
  quiz_code: string
  timer_minutes: number
  is_active: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  quiz_id: string
  question_text: string
  options: string[]
  correct_answer: number
  points: number
  time_limit: number
  order_index: number
  created_at: string
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  started_at: string
  completed_at?: string
  time_taken?: number
  is_completed: boolean
}

export interface Response {
  id: string
  attempt_id: string
  question_id: string
  selected_answer?: number
  is_correct?: boolean
  time_taken?: number
  answered_at: string
}

export interface Score {
  id: string
  quiz_id: string
  user_id: string
  attempt_id: string
  score: number
  total_points: number
  percentage: number
  time_taken: number
  created_at: string
}
