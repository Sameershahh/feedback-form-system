from fastapi import APIRouter, Query
import httpx, os
from dotenv import load_dotenv
from api.services import gemini, pdf, supabase, smtp

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

router = APIRouter()

@router.post("/feedback/summary")
async def feedback_summary(
    start_date: str = Query(..., description="Start date YYYY-MM-DD"),
    end_date: str = Query(..., description="End date YYYY-MM-DD"),
    event_name: str = Query("Workshop Summary", description="Event name for report")
):
    # Fetch reports from Supabase in the given range
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/feedback_reports",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
            },
            params=[
                ("select", "*"),
                ("eventdate", f"gte.{start_date}"),
                ("eventdate", f"lte.{end_date}")
            ]
        )
        response.raise_for_status()
        data = response.json()

    if not data:
        return {"message": "No feedback found in this range."}

    # Aggregate comments and suggestions
    all_comments = "\n".join([r.get("comments", "") for r in data if r.get("comments")])
    all_suggestions = "\n".join([r.get("suggestions", "") for r in data if r.get("suggestions")])

    # Generate HTML report using Gemini
    html_report = await gemini.generate_report(
        event_name=event_name,
        start_date=start_date,
        end_date=end_date,
        comments=all_comments,
        suggestions=all_suggestions
    )

    report_id = pdf.generate_report_id(f"summary-{start_date}-to-{end_date}")

    # Generate PDF file
    pdf_path = pdf.generate_pdf_from_html(html_report, report_id)

    # Save metadata to Supabase
    await supabase.save_report({
        "submissionId": report_id,
        "eventName": event_name,
        "eventDate": start_date,  # normalized to a single date
        "daterange": f"{start_date} → {end_date}",
        "attendeeName": "Multiple",
        "attendeeEmail": "N/A",
        "companyName": "Automation Labs",
        "rating": 0,
        "summary": [],
        "highlights": [],
        "improvementSuggestions": []
    }, report_id, pdf_path)

    # Send email with PDF attached
    email_sent = smtp.send_report({
        "eventName": event_name,
        "eventDate": f"{start_date} → {end_date}",
        "attendeeName": "Multiple",
        "attendeeEmail": "N/A",
        "companyName": "Automation Labs"
    }, pdf_path, summary_text="Overall feedback was positive, with suggestions to improve logistics and add case studies.")

    return {
        "event": event_name,
        "start": start_date,
        "end": end_date,
        "totalReports": len(data),
        "reportId": report_id,
        "pdfPath": pdf_path,
        "emailSent": email_sent
    }
