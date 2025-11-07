# utils.py
import json
import re
from typing import Dict, Any

def extract_json_from_text(text: str) -> Dict[str, Any]:
    """
    Extract JSON from LLM response text.
    Handles cases where JSON is wrapped in markdown code blocks.
    """
    try:
        # Try direct JSON parsing first
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    
    # Try extracting from markdown code blocks
    json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(1))
        except json.JSONDecodeError:
            pass
    
    # Try finding JSON object directly
    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except json.JSONDecodeError:
            pass
    
    raise ValueError("Could not extract valid JSON from response")


def clean_text(text: str) -> str:
    """Clean and normalize text from documents."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep alphanumeric, space, and common punctuation
    text = re.sub(r'[^\w\s\-.,@:()]', '', text)
    return text.strip()


def calculate_keyword_density(text: str, keywords: list) -> float:
    """Calculate keyword density in text."""
    text_lower = text.lower()
    keyword_count = 0
    
    for keyword in keywords:
        # Use word boundaries for better matching
        pattern = r'\b' + re.escape(keyword.lower()) + r'\b'
        matches = len(re.findall(pattern, text_lower))
        keyword_count += matches
    
    word_count = len(text_lower.split())
    
    if word_count == 0:
        return 0
    
    return (keyword_count / word_count) * 100


def validate_resume_content(content: str) -> bool:
    """Validate that resume has minimum required content."""
    # Check minimum length (should be at least 500 characters)
    if len(content.strip()) < 500:
        return False
    
    # Check for common resume sections
    content_lower = content.lower()
    common_sections = ["experience", "education", "skills"]
    found_sections = sum(1 for section in common_sections if section in content_lower)
    
    return found_sections >= 1


def format_response(status: str, data: Dict = None, error: str = None, message: str = None):
    """Format API response consistently."""
    response = {
        "status": status,
        "timestamp": __import__('datetime').datetime.now().isoformat()
    }
    
    if data:
        response["data"] = data
    if error:
        response["error"] = error
    if message:
        response["message"] = message
    
    return response