import os
import httpx
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

async def save_report(final_data: dict, submission_id: str, pdf_path: str, email_sent: bool = False):
    payload = {
        "submissionid": final_data.get("submissionId", submission_id),  # ✅ use submissionid only
        "eventname": final_data.get("eventName"),
        "eventdate": final_data.get("eventDate"),   # must be YYYY-MM-DD
        "daterange": final_data.get("daterange"),
        "attendeename": final_data.get("attendeeName"),
        "attendeeemail": final_data.get("attendeeEmail"),
        "companyname": final_data.get("companyName"),
        "rating": final_data.get("rating", 0),
        "comments": final_data.get("comments"),
        "suggestions": final_data.get("suggestions"),
        "sentiment": final_data.get("sentiment"),
        "sentimentcolor": final_data.get("sentimentColor"),
        "summary": final_data.get("summary", []),
        "highlights": final_data.get("highlights", []),
        "improvementsuggestions": final_data.get("improvementSuggestions", []),
        "pdfurl": pdf_path,
        "emailsent": email_sent,
        "urgency": final_data.get("urgency"),
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SUPABASE_URL}/rest/v1/feedback_reports",
                headers={**headers, "Prefer": "return=minimal"},
                json=payload
            )
            response.raise_for_status()
            print("✅ Supabase insert successful")
    except httpx.HTTPStatusError as e:
        print("❌ Supabase error:", e.response.text)
    except Exception as e:
        print("❌ Supabase error:", e)


async def get_reports_in_range(start_date: str, end_date: str):
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/feedback_reports",
            headers=headers,
            params=[
                ("select", "*"),
                ("eventdate", f"gte.{start_date}"),
                ("eventdate", f"lte.{end_date}")
            ]
        )
        response.raise_for_status()
        return response.json()
