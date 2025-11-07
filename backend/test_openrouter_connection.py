# test_openrouter_connection.py
import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = "https://openrouter.ai/api/v1"


if not API_KEY:
    print("❌ OPENROUTER_API_KEY not set in .env")
    exit()

print("🔍 Testing OpenRouter connection...")

try:
    r = requests.post(
        f"{BASE_URL}/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "openai/gpt-4o-mini",
            "messages": [{"role": "user", "content": "Say hello"}]
        },
        timeout=10
    )
    print(f"Status Code: {r.status_code}")
    print("Response:", r.text[:300])
except Exception as e:
    print("❌ Exception:", e)
