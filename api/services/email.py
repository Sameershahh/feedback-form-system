import os
import httpx
from dotenv import load_dotenv

load_dotenv()
BREVO_API_KEY = os.getenv("BREVO_API_KEY")

async def send_report(final_data: dict, pdf_url: str) -> bool:
    """
    Send feedback report via Brevo Transactional Email API.
    Returns True if email sent successfully, False otherwise.
    """
    try:
        payload = {
            "sender": {"email": "candidate.connectt@gmail.com"},
            "to": [{"email": "candidate.connectt@gmail.com"}],
            "subject": f"New Event Feedback – {final_data.get('eventName','Unknown')} ({final_data.get('rating','N/A')}/5)",
            "textContent": f"""
Summary: {final_data.get('summary','')}
Rating: {final_data.get('rating','')}
Sentiment: {final_data.get('sentiment','')}
Urgency: {final_data.get('urgency','N/A')}
Submission ID: {final_data.get('submissionId','')}
Timestamp: {final_data.get('timestamp','')}
PDF Report: {pdf_url}
"""
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={
                    "api-key": BREVO_API_KEY,
                    "Content-Type": "application/json"
                },
                json=payload
            )
            response.raise_for_status()
            print("✅ Email sent via Brevo API")
            return True

    except httpx.HTTPStatusError as e:
        print(f"❌ Brevo API error: {e.response.status_code} - {e.response.text}")
        return False
    except Exception as e:
        print("❌ General email error:", e)
        return False
