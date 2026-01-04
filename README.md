# Job CoPilot

AI-powered job search assistant that analyzes resume-job fit, generates tailored applications, and provides actionable career coaching.

[![Live Demo](https://img.shields.io/badge/Demo-Vercel-black)](https://job-copilot.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)

## Overview

Job CoPilot helps job seekers land their dream jobs faster through AI-driven analysis and content generation. Upload your resume and a job description to receive personalized insights, tailored cover letters, and strategic outreach templates.

**Built for the Austin AI Hackathon (March 2025)**

## Features

| Feature | Description |
|---------|-------------|
| **AI Resume Analysis** | Match score calculation based on job descriptions |
| **Skill Gap Detection** | Identifies missing qualifications with recommendations |
| **Cover Letter Generation** | Tailored cover letters for each application |
| **Cold Email Templates** | AI-generated recruiter outreach messages |
| **Company Insights** | Information about company culture and hiring patterns |
| **Interview Preparation** | AI-generated readiness assessment |
| **LinkedIn Strategy** | Networking and profile optimization suggestions |
| **Job Search Dashboard** | Track analyses and application progress |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/jravinder/job_copilot.git
cd job_copilot

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
pnpm dev

# Open http://localhost:3000
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Next.js API Routes
- **AI Model**: Groq API (Llama-3.3-70b-versatile)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: Nodemailer

### AI/ML
- **Model**: Llama-3.3-70b-versatile via Groq
- **Streaming**: Vercel AI SDK
- **Analysis**: Resume parsing, skill matching, content generation

## Installation

### Prerequisites

- Node.js >= 18.x
- pnpm (recommended) or npm
- Supabase account
- Groq API key

### Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Email (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=noreply@example.com
```

### Setup Steps

```bash
# 1. Clone repository
git clone https://github.com/jravinder/job_copilot.git
cd job_copilot

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Set up database (if using Supabase)
# Apply migrations via Supabase dashboard or CLI

# 5. Start development server
pnpm dev
```

## Project Structure

```
job_copilot/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   │
│   ├── actions/                  # Server actions
│   │   ├── analyze.ts            # Resume analysis
│   │   ├── chat.ts               # Chat functionality
│   │   └── match-jobs.ts         # Job matching
│   │
│   ├── api/                      # API routes
│   │   ├── analyze-resume/       # Analysis endpoint
│   │   ├── chat/                 # Chat streaming
│   │   ├── auth/                 # Authentication
│   │   └── email/                # Email sending
│   │
│   ├── analysis/                 # 3-step analysis workflow
│   ├── dashboard/                # User dashboard
│   ├── results/                  # Analysis results
│   ├── upload/                   # Resume upload
│   ├── login/                    # Authentication
│   └── ...                       # Other pages
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   └── ...                       # Custom components
│
├── lib/                          # Utilities
│   ├── supabase.ts               # Database client
│   ├── utils.ts                  # Helper functions
│   └── analytics.ts              # Analytics
│
├── types/                        # TypeScript types
│   ├── analysis.ts               # Analysis types
│   └── supabase.ts               # Database types
│
├── contexts/                     # React contexts
│   └── auth-context.tsx          # Auth state
│
├── hooks/                        # Custom hooks
│   └── use-auth.ts               # Auth hook
│
├── supabase/                     # Database
│   └── migrations/               # SQL migrations
│
└── public/                       # Static assets
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

### Analyses Table
```sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  resume_text TEXT,
  job_description TEXT,
  company_name TEXT,
  analysis_result JSONB,
  match_score INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze-resume` | POST | Analyze resume against job description |
| `/api/chat` | POST | AI chat with streaming response |
| `/api/chat-resume` | POST | Resume-specific chat |
| `/api/analyses` | GET/POST | CRUD for saved analyses |
| `/api/auth/signup` | POST | User registration |
| `/api/auth/check-user` | POST | Check user existence |

### Analysis Request

```typescript
POST /api/analyze-resume
Content-Type: application/json

{
  "resume": "Full resume text...",
  "jobDescription": "Job posting text..."
}
```

### Analysis Response

```typescript
{
  "matchScore": 85,
  "matchingSkills": ["Python", "React", "AWS"],
  "missingSkills": ["Kubernetes", "GraphQL"],
  "resumeSuggestions": ["Add metrics to achievements..."],
  "coverLetter": "Dear Hiring Manager...",
  "coldEmail": "Subject: Experienced Developer...",
  "recruiterPitch": "I'm a software engineer with...",
  "linkedinSuggestions": ["Update headline to...", "Add skills section..."],
  "companyInsights": "Company culture focuses on...",
  "interviewReadiness": {
    "score": 75,
    "strengths": ["Technical skills", "Experience"],
    "areasToImprove": ["System design", "Leadership examples"]
  }
}
```

## User Workflow

```
1. Upload Resume & Job Description
         ↓
2. Three-Step Analysis
   ├── Step 1: Review/Edit Resume
   ├── Step 2: Review/Edit Job Description
   └── Step 3: Run AI Analysis
         ↓
3. View Results
   ├── Match Score
   ├── Skill Gaps
   ├── Cover Letter
   ├── Cold Email
   ├── LinkedIn Tips
   └── Interview Prep
         ↓
4. Dashboard (save & track)
```

## Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Type checking
pnpm tsc --noEmit
```

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with `git push`

### Manual Deployment

```bash
# Build
pnpm build

# Start
pnpm start
```

## Configuration

### Next.js Config

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    unoptimized: true  // For static export
  }
};
```

### Tailwind Config

Custom theme with CSS variables for dynamic theming. See `tailwind.config.js`.

### shadcn/ui Config

```json
// components.json
{
  "style": "default",
  "tailwind": {
    "baseColor": "slate"
  }
}
```

## Roadmap

- [x] Resume-Job Fit Analysis
- [x] Cover Letter Generation
- [x] Cold Email Templates
- [x] Company Insights
- [x] Interview Preparation
- [ ] Job Market Trends & Salary Data
- [ ] LinkedIn Profile Optimization
- [ ] Multi-language Support
- [ ] Browser Extension

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Apache 2.0 - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Groq](https://groq.com) for blazing-fast AI inference
- [Vercel](https://vercel.com) for hosting and AI SDK
- [Supabase](https://supabase.com) for database and auth
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- Austin AI Hackathon for the inspiration
