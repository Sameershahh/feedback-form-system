import os
import smtplib
import ssl
import traceback
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("GMAIL_SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("GMAIL_SMTP_PORT", 587))
SMTP_USER = os.getenv("GMAIL_SMTP_USER")
SMTP_PASS = os.getenv("GMAIL_SMTP_PASS")

def send_report(final_data: dict, pdf_path: str, summary_text: str = "") -> bool:
    """
    Send feedback report via Gmail SMTP with PDF attachment.
    The email body is short and formal, while the full report is attached as a PDF.
    """
    try:
        msg = MIMEMultipart()
        msg["From"] = SMTP_USER
        msg["To"] = SMTP_USER  # for testing, send to yourself
        msg["Subject"] = f"Feedback Report – {final_data.get('eventName','Unknown')}"

        # Formal email body
        body = (
            f"Dear Organizer,\n\n"
            f"Please find attached the feedback report for {final_data.get('eventName','Unknown')} "
            f"covering {final_data.get('eventDate','')}.\n\n"
            f"{summary_text if summary_text else 'The report includes attendee feedback, sentiment analysis, and recommendations.'}\n\n"
            f"Best regards,\nAutomation Labs"
        )
        msg.attach(MIMEText(body, "plain"))

        # Attach PDF file
        if os.path.exists(pdf_path):
            with open(pdf_path, "rb") as f:
                pdf_attachment = MIMEApplication(f.read(), _subtype="pdf")
                pdf_attachment.add_header(
                    "Content-Disposition",
                    "attachment",
                    filename=os.path.basename(pdf_path)
                )
                msg.attach(pdf_attachment)
        else:
            print(f"⚠️ PDF file not found at {pdf_path}")

        # Send email via Gmail SMTP
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls(context=context)
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)

        print("✅ Email sent successfully with PDF attachment")
        return True

    except Exception as e:
        print("❌ Gmail SMTP error:", e)
        traceback.print_exc()
        return False
