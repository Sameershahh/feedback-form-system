from pydantic import BaseModel, EmailStr
from typing import Optional, List

class FeedbackSubmission(BaseModel):
    eventName: str
    eventDate: str
    attendeeName: Optional[str] = "Anonymous"
    attendeeEmail: Optional[EmailStr] = None
    companyName: Optional[str] = None
    rating: int
    comments: Optional[str] = "No comments provided"
    suggestions: Optional[str] = "No suggestions provided"

class AIAnalysis(BaseModel):
    sentiment: str
    summary: str
    highlights: List[str]
    improvementSuggestions: List[str]
    urgency: str

class FinalReport(BaseModel):
    submissionId: str
    timestamp: str
    sentimentColor: str
    sentiment: str
    summary: str
    highlights: List[str]
    improvementSuggestions: List[str]
    pdfUrl: str
    emailSent: bool
