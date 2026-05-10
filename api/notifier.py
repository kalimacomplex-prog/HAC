import os
import httpx

BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "")
SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "HAC Platform")


def send_job_notification(to_email: str, to_name: str, job: dict):
    if not BREVO_API_KEY or not SENDER_EMAIL:
        return

    status = job.get("status", "")
    agent_name = job.get("agent_name", "")
    job_id = job.get("_id", "")
    emoji = "✅" if status == "done" else "❌"

    html = f"""
    <h3>{emoji} Job finalizado</h3>
    <p><b>Agente:</b> {agent_name}</p>
    <p><b>Status:</b> {status}</p>
    <p><b>Job ID:</b> {job_id}</p>
    {"<pre>" + job.get("output", "")[:2000] + "</pre>" if job.get("output") else ""}
    {"<pre style='color:red'>" + job.get("error", "")[:2000] + "</pre>" if job.get("error") else ""}
    """

    payload = {
        "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
        "to": [{"email": to_email, "name": to_name}],
        "subject": f"{emoji} Job '{agent_name}' {status.upper()}",
        "htmlContent": html,
    }

    try:
        with httpx.Client(timeout=10) as client:
            client.post(
                "https://api.brevo.com/v3/smtp/email",
                json=payload,
                headers={"api-key": BREVO_API_KEY},
            )
    except Exception:
        pass
