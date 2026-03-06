from fastapi import APIRouter, Body
from api.models.feedback import FeedbackSubmission, FinalReport
from api.services import cleaning, gemini, pdf, supabase
from api.services.smtp import send_report
from datetime import datetime

router = APIRouter()

@router.post("/submit", response_model=FinalReport)
async def submit_feedback(feedback: FeedbackSubmission = Body(...)):
    cleaned = cleaning.clean(feedback)
    analysis = await gemini.analyze(cleaned)
    final_data = cleaning.merge(cleaned, analysis)

    html_report = pdf.generate_html(final_data)
    submission_id = final_data.get("submissionId") or pdf.generate_report_id("submission")
    pdf_path = pdf.generate_pdf_from_html(html_report, submission_id)

    # ✅ Ensure submissionid is present
    final_data["submissionId"] = submission_id

    await supabase.save_report(final_data, submission_id, pdf_path)
    email_sent = send_report(final_data, pdf_path)

    return FinalReport(**final_data, reportId=submission_id, pdfUrl=pdf_path, emailSent=email_sent)


@router.get("/feedback/summary")
async def feedback_summary(start: str, end: str):
    submissions = await supabase.get_reports_in_range(start, end)
    if not submissions:
        return {"message": "No submissions found in this range."}

    # Aggregate raw data for Gemini prompt
    all_comments = "\n".join([s.get("comments", "") for s in submissions if s.get("comments")])
    all_suggestions = "\n".join([s.get("suggestions", "") for s in submissions if s.get("suggestions")])

    # ✅ Always call Gemini for AI-generated report
    html_report = await gemini.generate_report(
        event_name=f"Summary Report ({start} to {end})",
        start_date=start,
        end_date=end,
        comments=all_comments,
        suggestions=all_suggestions
    )

    # Generate identifiers + PDF
    submission_id = pdf.generate_report_id(f"summary-{start}-to-{end}")
    pdf_path = pdf.generate_pdf_from_html(html_report, submission_id)

    # Normalize eventdate
    event_date = datetime.strptime(start, "%Y-%m-%d").date().isoformat()

    # ✅ Save to Supabase (with required fields)
    await supabase.save_report({
        "submissionId": submission_id,
        "eventName": f"Summary Report ({start} to {end})",
        "eventDate": event_date,
        "daterange": f"{start} → {end}",
        "attendeeName": "Multiple",
        "attendeeEmail": "N/A",
        "companyName": "Automation Labs",
        "rating": 0,   # required by schema
        "summary": [],
        "highlights": [],
        "improvementSuggestions": []
    }, submission_id, pdf_path)

    # ✅ Email to admin
    email_sent = send_report({
        "eventName": f"Summary Report ({start} to {end})",
        "eventDate": event_date,
        "attendeeName": "Multiple",
        "attendeeEmail": "N/A",
        "companyName": "Automation Labs"
    }, pdf_path, summary_text="AI-generated summary report attached.")

    return {
        "start": start,
        "end": end,
        "totalSubmissions": len(submissions),
        "submissionId": submission_id,
        "pdfPath": pdf_path,
        "emailSent": email_sent
    }
