# PRODUCT BLUEPRINT: RESONATE
**Mission:** Build the "Operational Command Center" for career management.
**Brand:** "Stealth Command" aesthetic (Midnight Slate #0B1120).
**Mascot:** "Rez" (The Pulse) - A glowing green energy orb (CSS animation).

## TECH STACK
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Auth:** Clerk
- **Database:** Supabase (PostgreSQL)
- **AI:** Anthropic Claude 3.5 Sonnet
- **PDF Engine:** @react-pdf/renderer

## CORE MODULES
1.  **Digital Twin Engine:** A pixel-perfect resume generator replicating the "Bennett" executive format (0.75" margins, dense text, Roboto font).
2.  **The Command Center:** A dashboard tracking "Velocity" (apps/week) and "Compliance" (consistency).
3.  **FTQ Gatekeeper:** A "First Time Quality" checker that blocks downloads if errors (typos, placeholders) are found.
4.  **The Hunter:** Chrome Extension for auto-filling applications and scraping data.
5.  **Recruiter CRM:** Vendor management system for tracking hiring managers.
6.  **Viral Loop:** "Optimized by Resonate" watermark on free PDFs.

## DATABASE SCHEMA (Supabase)
- `profiles`: user_id (PK), email, subscription_status, credits
- `resumes`: id, user_id, content (JSON), version_name
- `jobs`: id, user_id, company, title, status, job_description_text
- `recruiters`: id, user_id, name, company, linkedin_url, status

## DESIGN SYSTEM
- **Background:** `bg-slate-950` (Midnight Slate)
- **Primary:** `text-indigo-500` (Governance Blue)
- **Success:** `text-green-400` (Pulse Green)
- **Font:** Inter (UI), Roboto (PDF)


