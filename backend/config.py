# config.py
import os
from dotenv import load_dotenv

load_dotenv()

# OpenRouter API Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

LLM_MODEL = "openai/gpt-4o-mini"  # GPT-4o Mini model

# ATS Keywords
ATS_KEYWORDS = {
    "technical_skills": [
        "python", "java", "javascript", "c++", "sql", "react", "angular", "node.js",
        "aws", "azure", "gcp", "docker", "kubernetes", "git", "linux", "windows",
        "machine learning", "data analysis", "rest api", "microservices", "mongodb",
        "postgresql", "mysql", "redis", "elasticsearch", "apache spark", "tensorflow"
    ],
    "soft_skills": [
        "leadership", "communication", "teamwork", "problem-solving", "project management",
        "time management", "analytical", "creative", "adaptable", "collaborative",
        "critical thinking", "agile", "scrum"
    ],
    "certifications": [
        "aws certified", "gcp certified", "microsoft certified", "certified kubernetes",
        "pmp", "comptia", "cissp", "azure", "google cloud"
    ],
    "formats": [
        "pdf", "docx", "doc", "html", "rtf"
    ]
}

# File Configuration
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc"}

# Prompts
ATS_SCORE_PROMPT = """
Analyze this resume and provide an ATS (Applicant Tracking System) compatibility score.
Consider the following factors:
1. Format and structure (proper sections like Summary, Experience, Education, Skills)
2. Keyword presence and density
3. Use of standard formatting (no images, tables, special characters that break parsing)
4. Clear job titles and company names
5. Proper date formatting
6. Contact information presence

Provide your response ONLY in this exact JSON format:
{{
    "ats_score": <number between 0-100>,
    "score_breakdown": {{
        "format_structure": <0-25>,
        "keyword_optimization": <0-25>,
        "parseability": <0-20>,
        "clarity": <0-15>,
        "completeness": <0-15>
    }},
    "strengths": [<list of strong points>],
    "weaknesses": [<list of improvement areas>],
    "suggestions": [<list of specific improvements>]
}}
"""

JD_MATCH_PROMPT = """
Analyze this resume against the provided job description. Provide a detailed match analysis.

Resume:
{resume_content}

Job Description:
{jd_content}

Provide your response ONLY in this exact JSON format:
{{
    "overall_match_score": <number between 0-100>,
    "match_breakdown": {{
        "skills_match": <0-30>,
        "experience_match": <0-25>,
        "qualification_match": <0-20>,
        "responsibility_alignment": <0-25>
    }},
    "matched_skills": [<skills present in both resume and JD>],
    "missing_skills": [<skills required by JD but missing from resume>],
    "matched_responsibilities": [<responsibilities the candidate has done>],
    "missing_responsibilities": [<key responsibilities from JD not in resume>],
    "strengths": [<why candidate is a good fit>],
    "gaps": [<areas where candidate is lacking>],
    "recommendations": [<specific improvements to resume for this JD>],
    "final_assessment": "<2-3 sentence summary of fit>"
}}
"""