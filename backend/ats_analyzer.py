# ats_analyzer.py
from llm_service import LLMService
from config import ATS_SCORE_PROMPT, ATS_KEYWORDS
from utils import validate_resume_content, calculate_keyword_density


class ATSAnalyzer:
    """Analyze resume for ATS (Applicant Tracking System) compatibility."""
    
    def __init__(self):
        self.llm_service = LLMService()
        self.ats_keywords = ATS_KEYWORDS
    
    def analyze(self, resume_text: str) -> dict:
        """
        Perform complete ATS analysis on resume.
        Returns detailed ATS score and recommendations.
        """
        # Validate resume has sufficient content
        if not validate_resume_content(resume_text):
            return {
                "status": "error",
                "error": "Resume content is too short or missing key sections",
                "ats_score": 0
            }
        
        # Get LLM analysis
        llm_result = self.llm_service.analyze_ats_score(
            resume_text,
            ATS_SCORE_PROMPT
        )
        
        # Calculate additional metrics
        all_keywords = (
            self.ats_keywords["technical_skills"] +
            self.ats_keywords["soft_skills"] +
            self.ats_keywords["certifications"]
        )
        
        keyword_density = calculate_keyword_density(resume_text, all_keywords)
        
        # Add keyword analysis to result
        llm_result["keyword_density"] = round(keyword_density, 2)
        llm_result["technical_skills_found"] = self._find_keywords(
            resume_text,
            self.ats_keywords["technical_skills"]
        )
        llm_result["soft_skills_found"] = self._find_keywords(
            resume_text,
            self.ats_keywords["soft_skills"]
        )
        llm_result["certifications_found"] = self._find_keywords(
            resume_text,
            self.ats_keywords["certifications"]
        )
        
        return llm_result
    
    def _find_keywords(self, text: str, keywords: list) -> list:
        """Find which keywords are present in text."""
        import re
        text_lower = text.lower()
        found = []
        
        for keyword in keywords:
            pattern = r'\b' + re.escape(keyword.lower()) + r'\b'
            if re.search(pattern, text_lower):
                found.append(keyword)
        
        return list(set(found))  # Remove duplicates