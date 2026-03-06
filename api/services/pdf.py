import uuid
from xhtml2pdf import pisa
import io
import os

def generate_html(final_data: dict) -> str:
    return f"""
    <html>
      <head>
        <style>
          body {{ font-family: Arial, sans-serif; margin: 20px; }}
          h1 {{ color: #2c3e50; }}
          .sentiment {{ font-weight: bold; color: {final_data.get("sentimentColor", "black")}; }}
          ul {{ margin-left: 20px; }}
        </style>
      </head>
      <body>
        <h1>Feedback Report</h1>
        <p><strong>Event:</strong> {final_data.get('eventName','')}</p>
        <p><strong>Date:</strong> {final_data.get('eventDate','')}</p>
        <p><strong>Attendee:</strong> {final_data.get('attendeeName','')} ({final_data.get('attendeeEmail','')})</p>
        <p><strong>Company:</strong> {final_data.get('companyName','')}</p>
        <p><strong>Rating:</strong> {final_data.get('rating','')}</p>
        <p><strong>Comments:</strong> {final_data.get('comments','')}</p>
        <p><strong>Suggestions:</strong> {final_data.get('suggestions','')}</p>
        <p class="sentiment"><strong>Sentiment:</strong> {final_data.get('sentiment','')}</p>
        <p><strong>Summary:</strong> {final_data.get('summary','')}</p>
        <h2>Highlights</h2>
        <ul>{"".join(f"<li>{h}</li>" for h in final_data.get("highlights", []))}</ul>
        <h2>Improvement Suggestions</h2>
        <ul>{"".join(f"<li>{s}</li>" for s in final_data.get("improvementSuggestions", []))}</ul>
      </body>
    </html>
    """

def generate_report_id(submission_id: str) -> str:
    unique_suffix = uuid.uuid4().hex[:6]
    return f"{submission_id}-{unique_suffix}"

def generate_pdf_from_html(html: str, report_id: str) -> str:
    """
    Convert HTML string into a PDF file and return the file path.
    """
    os.makedirs("reports", exist_ok=True)
    pdf_filename = f"reports/{report_id}.pdf"
    with open(pdf_filename, "wb") as f:
        pisa.CreatePDF(io.StringIO(html), dest=f)
    return pdf_filename
