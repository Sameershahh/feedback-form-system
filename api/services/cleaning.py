import re, datetime, random, string
from api.models.feedback import FeedbackSubmission

def clean(feedback: FeedbackSubmission) -> dict:
    # Convert to dict and trim strings
    data = feedback.dict()
    for k, v in data.items():
        if isinstance(v, str):
            data[k] = v.strip()

    # Required fields: must not be empty
    if not data.get("eventName"):
        # ⚠️ Error possibility: frontend didn't send required Event Name
        data["eventName"] = "Unknown Event"
    if not data.get("eventDate"):
        # ⚠️ Error possibility: frontend didn't send required Event Date
        data["eventDate"] = datetime.datetime.utcnow().date()
    if data.get("rating") is None:
        # ⚠️ Error possibility: frontend didn't send required Rating
        data["rating"] = 0

    # Optional fields: replace empty with "NULL" for lead tracking
    if not data.get("attendeeName"):
        data["attendeeName"] = "NULL"
    if not data.get("attendeeEmail"):
        data["attendeeEmail"] = "NULL"
    if not data.get("companyName"):
        data["companyName"] = "NULL"

    # Comments / Suggestions defaults
    if not data.get("comments"):
        data["comments"] = "No comments provided"
    if not data.get("suggestions"):
        data["suggestions"] = "No suggestions provided"

    # Email validation
    email = data.get("attendeeEmail")
    if email == "NULL":
        # ⚠️ Confirmability: optional email left blank → stored as "NULL"
        data["hasValidEmail"] = False
    elif not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
        # ⚠️ Error possibility: malformed email format
        data["hasValidEmail"] = False
    else:
        data["hasValidEmail"] = True

    # Submission ID + timestamp
    ts = datetime.datetime.utcnow().isoformat()
    rand = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    data["submissionId"] = f"FB-{int(datetime.datetime.utcnow().timestamp())}-{rand}"
    data["timestamp"] = ts
    # ⚠️ Confirmability: ensure submissionId uniqueness during testing

    # Initialize AI fields (to be filled later by gemini.analyze)
    data["sentiment"] = None
    data["sentimentColor"] = None
    data["summary"] = None
    data["highlights"] = []
    data["improvementSuggestions"] = []
    data["urgency"] = None

    return data


def merge(cleaned: dict, analysis: dict) -> dict:
    # Merge AI analysis results into cleaned data
    sentiment_map = {"Positive": "green", "Neutral": "orange", "Negative": "red"}
    cleaned.update(analysis)
    # ⚠️ Confirmability: check that analysis["sentiment"] is always set
    cleaned["sentimentColor"] = sentiment_map.get(analysis.get("sentiment", "Neutral"), "orange")
    return cleaned
