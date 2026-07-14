import os

from dotenv import load_dotenv
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token

load_dotenv()

FIREBASE_PROJECT_ID = os.environ["FIREBASE_PROJECT_ID"]
_request = google_requests.Request()


def verify_firebase_id_token(token: str) -> dict:
    """Verifies a Firebase ID token and returns its claims (raises ValueError if invalid)."""
    return google_id_token.verify_firebase_token(token, _request, audience=FIREBASE_PROJECT_ID)
