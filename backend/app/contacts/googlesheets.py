import os
import gspread
from google.oauth2.service_account import Credentials
from app.core.configs import settings

CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "google-credentials.json")
# Google Sheet
GOOGLE_SHEET_ID = settings.GOOGLE_SHEET_ID  

def append_to_sheet(row: list):
    scopes = ["https://www.googleapis.com/auth/spreadsheets"]
    creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(GOOGLE_SHEET_ID)
    worksheet = sh.sheet1  # or use .worksheet('SheetName')
    worksheet.append_row(row)
