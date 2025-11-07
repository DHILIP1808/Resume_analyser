# jd_analyzer.py
from llm_service import LLMService
from config import JD_MATCH_PROMPT
from utils import validate_resume_content


class JDAnalyzer:
    """Analyze resume against job description."""
    
    def __init__(self):
        self.llm_service = LLMService()
    
    def analyze(self, resume_text: str, jd_text: str) -> dict:
        """
        Analyze resume against job description.
        Returns match score, gaps, strengths, and recommendations.
        """
        # Validate both resume and JD have sufficient content
        if not validate_resume_content(resume_text):
            return {
                "status": "error",
                "error": "Resume content is too short or missing key sections"
            }
        
        if len(jd_text.strip()) < 200:
            return {
                "status": "error",
                "error": "Job description is too short (minimum 200 characters required)"
            }
        
        # Get LLM analysis
        llm_result = self.llm_service.analyze_jd_match(
            resume_text,
            jd_text,
            JD_MATCH_PROMPT
        )
        
        return llm_result
    
    def compare_multiple_jds(self, resume_text: str, jd_texts: list) -> dict:
        """
        Compare resume against multiple job descriptions.
        Useful for finding best-fit position.
        """
        results = []
        
        for idx, jd_text in enumerate(jd_texts):
            try:
                analysis = self.analyze(resume_text, jd_text)
                analysis["jd_index"] = idx
                results.append(analysis)
            except Exception as e:
                results.append({
                    "jd_index": idx,
                    "status": "error",
                    "error": str(e)
                })
        
        # Sort by match score (highest first)
        valid_results = [r for r in results if "overall_match_score" in r]
        valid_results.sort(
            key=lambda x: x.get("overall_match_score", 0),
            reverse=True
        )
        
        return {
            "total_jds": len(jd_texts),
            "results": valid_results,
            "best_match_index": results[0]["jd_index"] if results else None
        }