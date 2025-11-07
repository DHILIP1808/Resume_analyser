# llm_service.py
import requests
import json
from config import OPENROUTER_API_KEY, OPENROUTER_BASE_URL, LLM_MODEL
from utils import extract_json_from_text


class LLMService:
    """Service to interact with OpenRouter LLM API."""
    
    def __init__(self):
        self.api_key = OPENROUTER_API_KEY
        self.base_url = OPENROUTER_BASE_URL
        self.model = LLM_MODEL
        
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable not set")
    
    def call_llm(self, prompt: str, max_tokens: int = 2000) -> str:
        """
        Make a call to the OpenRouter LLM API.
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": max_tokens,
            "temperature": 0.7
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            
            result = response.json()
            
            if "choices" in result and len(result["choices"]) > 0:
                message = result["choices"][0]["message"]["content"]
                return message
            else:
                raise ValueError("Unexpected API response format")
        
        except requests.exceptions.RequestException as e:
            raise ValueError(f"Error calling LLM API: {str(e)}")
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON response from API")
    
    def analyze_ats_score(self, resume_text: str, prompt_template: str) -> dict:
        """
        Analyze resume for ATS score using LLM.
        """
        prompt = f"{prompt_template}\n\nResume:\n{resume_text}"
        
        response = self.call_llm(prompt)
        result = extract_json_from_text(response)
        
        return result
    
    def analyze_jd_match(self, resume_text: str, jd_text: str, prompt_template: str) -> dict:
        """
        Analyze resume against job description using LLM.
        """
        prompt = prompt_template.format(
            resume_content=resume_text,
            jd_content=jd_text
        )
        
        response = self.call_llm(prompt)
        result = extract_json_from_text(response)
        
        return result