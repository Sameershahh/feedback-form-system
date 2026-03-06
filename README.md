# Event Feedback System

A full-stack event feedback platform built with Next.js, FastAPI, and Supabase, featuring AI-powered analysis, automated PDF report generation, SMTP email delivery, database persistence, and an analytics dashboard with date-range reporting.

---

## Overview

The Event Feedback System is designed to streamline the process of collecting, analyzing, and reporting on event attendee feedback. The frontend is built with Next.js and communicates with a FastAPI backend that handles all core business logic. When a submission is received, the backend cleans and validates the data, runs it through an AI analysis pipeline powered by Gemini 2.5, generates a branded PDF report, delivers it to the organizer via email, and persists everything to a Supabase database. A separate dashboard interface provides real-time analytics and the ability to generate consolidated reports across custom date ranges.

---

## Features

- Branded feedback form with full field validation and data normalization
- AI-powered sentiment analysis and feedback summarization via Gemini 2.5
- Automated PDF report generation from branded HTML templates
- Email delivery to the organizer via Gmail SMTP
- Persistent database storage of all submissions and AI outputs
- Analytics dashboard with filtering by date range, event name, and sentiment
- Bulk date-range report generation with combined AI summary and PDF export
- Post-submission success screen with confirmation UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, Tailwind CSS |
| Backend | FastAPI (Python) |
| AI Analysis | Google Gemini 2.5 |
| Email Delivery | Gmail SMTP (TLS, Port 587) |
| PDF Generation | HTML-to-PDF conversion |
| Database | Supabase (PostgreSQL) |

---

## System Architecture

```
Form Submission
      |
      v
Data Cleaning & Normalization
      |
      v
Gemini 2.5 AI Analysis
      |
      v
HTML Report Generation (Branded)
      |
      v
PDF Conversion
      |
      +-----> SMTP Email to Organizer
      |
      +-----> Database Storage
      |
      v
Dashboard & Analytics
      |
      v
Date-Range Bulk Report (PDF + Email)
```

---

## Form Fields

- Event Name
- Event Date
- Attendee Name
- Attendee Email
- Company Name (optional)
- Rating (1 to 5)
- Feedback / Comments
- Suggestions / Improvements

---

## AI Analysis Output

Each submission is analyzed by Gemini 2.5, which returns a structured JSON object with the following fields:

```json
{
  "sentiment": "Positive | Neutral | Negative",
  "summary": "2-3 sentence summary of the feedback",
  "highlights": ["key point 1", "key point 2"],
  "improvementSuggestions": ["suggestion 1", "suggestion 2"],
  "urgency": "Low | Medium | High"
}
```

---

## Database Schema

Table: `feedback_reports`

| Field | Type |
|---|---|
| submissionId | string |
| timestamp | ISO datetime |
| eventName | string |
| eventDate | date |
| attendeeName | string |
| attendeeEmail | string |
| companyName | string |
| rating | integer |
| comments | text |
| suggestions | text |
| sentiment | string |
| summary | text |
| urgency | string |
| highlights | JSON array |
| improvementSuggestions | JSON array |
| pdfUrl | string |
| emailSent | boolean |

---

## Dashboard

The analytics dashboard provides:

- Date range filter
- Event name and sentiment filters
- Total feedback count
- Average rating
- Sentiment breakdown (Positive / Neutral / Negative)
- High urgency submission count
- Tabular view of all submissions with PDF access links
- Bulk report generation for selected date ranges

### Date-Range Bulk Report

When a date range is selected and the report generation is triggered, the system:

1. Retrieves all submissions within the selected range
2. Passes the dataset to Gemini for a consolidated analysis
3. Generates a combined branded PDF report
4. Emails the report to the configured admin address

---

## Email Configuration

| Setting | Value |
|---|---|
| SMTP Host | smtp.gmail.com |
| Port | 587 |
| Security | TLS |
| Recipient | sameershah.dev@gmail.com |

The email includes the AI-generated summary, rating, sentiment, submission ID, timestamp, and a link to the PDF report. The SMTP password is stored as an environment secret and is never exposed in the codebase.

---

## Branding

- Primary accent color: `#A6F4C5` (light green)
- Background: white
- Text: black
- UI style: rounded cards, soft shadows, clean Tailwind layout
- Logo displayed at the top of the feedback form and dashboard

---

## Getting Started

1. Clone the repository
2. Install frontend dependencies and run the Next.js development server
3. Set up a Python virtual environment and install FastAPI dependencies
4. Configure your Supabase project and add the connection credentials to your environment variables
5. Add your Gmail SMTP credentials and Gemini API key to the backend environment file
6. Run the FastAPI server
7. Deploy the frontend and backend to your preferred hosting environment
8. Share the feedback form URL with event attendees
9. Monitor submissions and reports from the dashboard

---

## License

This project is proprietary. All rights reserved.

##  Author
**Sameer Shah** — AI & Full-Stack Developer  
[Portfolio](https://sameershah-portfolio.vercel.app/) 
