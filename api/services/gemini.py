import os
import httpx
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

BASE_URL = "https://generativelanguage.googleapis.com/v1"
MODEL_NAME = "gemini-2.5-flash"

async def list_models() -> dict:
    """Fetch available models for this API key."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(
            f"{BASE_URL}/models",
            params={"key": GEMINI_API_KEY}
        )
        response.raise_for_status()
        return response.json()

async def analyze(cleaned_data: dict) -> dict:
    """
    Analyze a single feedback entry.
    Returns sentiment, summary, highlights, and improvement suggestions.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{BASE_URL}/models/{MODEL_NAME}:generateContent",
                params={"key": GEMINI_API_KEY},
                json={
                    "contents": [{
                        "parts": [{
                            "text": (
                                "Analyze the following feedback and return JSON with keys:\n"
                                "sentiment (Positive, Neutral, Negative),\n"
                                "summary (short text),\n"
                                "highlights (list of strings),\n"
                                "improvementSuggestions (list of strings).\n\n"
                                f"Feedback:\n{cleaned_data.get('comments','')}\n"
                                f"Suggestions:\n{cleaned_data.get('suggestions','')}\n"
                            )
                        }]
                    }]
                }
            )
            response.raise_for_status()
            result = response.json()

        text_output = (
            result.get("candidates", [{}])[0]
                 .get("content", {})
                 .get("parts", [{}])[0]
                 .get("text", "")
        )

        return {
            "sentiment": "Positive" if "Positive" in text_output else
                         "Negative" if "Negative" in text_output else "Neutral",
            "summary": text_output[:200] if text_output else "Summary not available",
            "highlights": ["Engaging content", "Clear delivery"],  # placeholder
            "improvementSuggestions": ["Add more case studies"],   # placeholder
        }

    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            print("Gemini error: Rate limit exceeded (429)")
        else:
            print(f"Gemini error: {e.response.status_code} - {e.response.text}")
        return {
            "sentiment": "Unknown",
            "summary": "Analysis failed due to API error",
            "highlights": [],
            "improvementSuggestions": []
        }
    except Exception as e:
        print("Gemini error:", e)
        return {
            "sentiment": "Unknown",
            "summary": "Analysis failed",
            "highlights": [],
            "improvementSuggestions": []
        }

async def generate_report(event_name: str, start_date: str, end_date: str,
                          comments: str, suggestions: str) -> str:
    """
    Generate a polished HTML report for multiple feedbacks in a date range.
    Returns full HTML content (ready for PDF conversion).
    """
    try:
        prompt = (
            f"Write a professional feedback summary report for the event '{event_name}' "
            f"covering the date range {start_date} to {end_date}. "
            f"Use the following attendee comments and suggestions:\n\n"
            f"Comments:\n{comments}\n\n"
            f"Suggestions:\n{suggestions}\n\n"
            "The report should include:\n"
            "- Overall sentiment analysis (positive/neutral/negative with percentages)\n"
            "- A concise executive summary paragraph\n"
            "- Key highlights (bullet points)\n"
            "- Common improvement suggestions (bullet points)\n"
            "- A concluding recommendation\n\n"
            "Format the output as clean HTML suitable for a PDF report. "
            "Use headings, paragraphs, and lists for readability."
        )

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{BASE_URL}/models/{MODEL_NAME}:generateContent",
                params={"key": GEMINI_API_KEY},
                json={"contents": [{"parts": [{"text": prompt}]}]}
            )
            response.raise_for_status()
            result = response.json()

        return (
            result.get("candidates", [{}])[0]
                  .get("content", {})
                  .get("parts", [{}])[0]
                  .get("text", "<html><body><p>No content returned.</p></body></html>")
        )

    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            print("Gemini report error: Rate limit exceeded (429)")
        else:
            print(f"Gemini report error: {e.response.status_code} - {e.response.text}")
        # ✅ Fallback HTML so PDF is never empty
        return f"""
        <html><body>
          <h1>Feedback Summary Report</h1>
          <p>Event: {event_name}</p>
          <p>Date Range: {start_date} → {end_date}</p>
          <p><strong>Report generation failed due to API error ({e.response.status_code}).</strong></p>
          <p>Comments provided: {comments[:200]}...</p>
          <p>Suggestions provided: {suggestions[:200]}...</p>
        </body></html>
        """
    except Exception as e:
        print("Gemini report error:", e)
        return f"""
        <html><body>
          <h1>Feedback Summary Report</h1>
          <p>Event: {event_name}</p>
          <p>Date Range: {start_date} → {end_date}</p>
          <p><strong>Report generation failed due to unexpected error.</strong></p>
        </body></html>
        """
