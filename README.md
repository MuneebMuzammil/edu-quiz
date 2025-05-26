# 🎓 EduQuiz – Real-Time Quiz Platform for Educators & Learners

EduQuiz is a modern, interactive quiz platform designed to enhance digital learning through gamified experiences, real-time performance tracking, and a clean, responsive UI. Built using cutting-edge web technologies, it enables educators to create engaging quizzes and track learner progress with rich analytics and intuitive dashboards.

--

## 🚀 Key Features

- ✍️ **Quiz Builder**  
  Create timed multiple-choice quizzes with scoring, time limits, and point assignment.

- ⚡ **Live Quiz Player**  
  Learners can take quizzes in real-time with animated feedback for correct/wrong answers.

- 📊 **Score Analytics**  
  Visualize individual and overall performance using dynamic charts.

- 🏆 **Leaderboard System**  
  Ranked results with animated scoreboards and live updates.

- 🧑‍🏫 **Educator Dashboard**  
  View attempts, analyze trends, and manage quizzes and learner stats.

- 🌙 **Theme Toggle**  
  Fully functional dark/light mode with smooth transitions and persistence.

- 📱 **Mobile-Responsive**  
  Seamless experience across desktop, tablet, and mobile devices.

---

## 🧱 Tech Stack

- **Framework**: Next.js (App Router)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **UI**: Accessible components with Radix UI primitives

---

## 📂 Project Structure

```bash
edu-quiz/
├── app/                 # App routes and pages (Next.js App Router)
│   ├── dashboard/       # Dashboard for educators and learners
│   ├── quiz-builder/    # Create/edit quizzes
│   ├── quiz/            # Play quizzes
│   ├── analytics/       # Score & time charts
│   ├── leaderboard/     # Live leaderboard
│   ├── settings/        # Profile & theme toggle
│   └── layout.tsx       # Global layout wrapper
├── components/          # Shared and reusable UI components
│   ├── QuizPlayer.tsx
│   ├── QuizBuilder.tsx
│   ├── Navbar.tsx
│   ├── ThemeToggle.tsx
│   └── FeedbackWidget.tsx
├── contexts/            # Theme context
├── hooks/               # Custom hooks (e.g., use-mobile, use-toast)
├── lib/                 # Supabase client & utilities
├── public/              # Static assets (images, sounds)
├── styles/              # Global styles
└── tailwind.config.ts   # Tailwind theme configuration

🛠 Getting Started
Clone the repo and follow the steps below to run the app locally:

1. Clone the Repository

git clone https://github.com/your-username/edu-quiz.git
cd edu-quiz

2. Install Dependencies

pnpm install

3. Set Up Environment Variables
Create a .env.local file and add your Supabase project keys:

env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

4. Run the Development Server

pnpm dev
The app will be running on http://localhost:3000

📊 Analytics & Leaderboard
The analytics dashboard provides:

Average quiz scores

Time spent per quiz

Correct vs incorrect answer ratio

Visual representation with Recharts (Bar, Line, Pie)

The leaderboard shows:

Top-performing learners

Animated rankings with score/time comparison

🔒 Authentication
Authentication is powered by Supabase. Users can sign up or log in with:

Email/password

Social providers (optional)

Roles (educator or learner) are automatically assigned and enforced via route guards.

🎨 Design Highlights
Theme Toggle with localStorage persistence

Micro-animations using Framer Motion for page transitions, feedback, and buttons

Custom Widgets for correct/wrong answer feedback

Confetti & Sound FX on quiz success

📌 Future Improvements
Quiz templates for quick creation

CSV/PDF result export

XP system and streak tracking

Real-time quiz rooms and chat

🧑‍💻 Author
Crafted with precision and care by Muneeb Muzammil
For collaboration, inquiries, or feature contributions, feel free to open an issue or pull request.

📄 License
MIT License – use, modify, and build upon this project with attribution.

