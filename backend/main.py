# main.py
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import tempfile
from typing import Optional, List

from resume_extractor import ResumeExtractor
from ats_analyzer import ATSAnalyzer
from jd_analyzer import JDAnalyzer
from utils import format_response, validate_resume_content

app = FastAPI(
    title="AI Resume Analyzer",
    description="Analyze resumes for ATS compatibility and JD matching",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize analyzers
ats_analyzer = ATSAnalyzer()
jd_analyzer = JDAnalyzer()
resume_extractor = ResumeExtractor()


@app.get("/")
def read_root():
    """Root endpoint - API information."""
    return {
        "message": "AI Resume Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "ats_score": "/api/ats-score",
            "jd_match": "/api/jd-match",
            "compare_jds": "/api/compare-jds",
            "health": "/health"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return format_response("success", {"status": "healthy"})


@app.post("/api/ats-score")
async def analyze_ats_score(
    file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None)
):
    """
    Analyze resume for ATS compatibility.
    
    Either upload a file (PDF, DOCX) or provide resume text.
    Returns ATS score, breakdown, strengths, weaknesses, and suggestions.
    """
    try:
        # Validate input
        if not file and not resume_text:
            raise HTTPException(
                status_code=400,
                detail="Either 'file' or 'resume_text' must be provided"
            )
        
        # Extract resume text
        if file:
            file_extension = os.path.splitext(file.filename)[1].lower()
            
            if file_extension not in [".pdf", ".docx", ".doc"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file format. Supported: PDF, DOCX, DOC"
                )
            
            # Save uploaded file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
                content = await file.read()
                tmp_file.write(content)
                tmp_path = tmp_file.name
            
            try:
                resume_text = resume_extractor.extract_from_file(tmp_path)
            finally:
                os.unlink(tmp_path)
        
        # Validate resume content
        if not validate_resume_content(resume_text):
            raise HTTPException(
                status_code=400,
                detail="Resume is too short or missing key sections. Minimum 500 characters required."
            )
        
        # Analyze ATS score
        result = ats_analyzer.analyze(resume_text)
        
        return format_response("success", result)
    
    except HTTPException:
        raise
    except Exception as e:
        return format_response("error", error=str(e)), 500


@app.post("/api/jd-match")
async def analyze_jd_match(
    jd_text: str = Form(...),
    file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None)
):
    """
    Analyze resume against job description.
    
    Either upload a resume file (PDF, DOCX) or provide resume text.
    Provide job description as text.
    Returns match score, gaps, recommendations, and detailed analysis.
    """
    try:
        # Validate JD input
        if not jd_text or len(jd_text.strip()) < 200:
            raise HTTPException(
                status_code=400,
                detail="Job description must be at least 200 characters"
            )
        
        # Validate resume input
        if not file and not resume_text:
            raise HTTPException(
                status_code=400,
                detail="Either 'file' or 'resume_text' must be provided"
            )
        
        # Extract resume text
        if file:
            file_extension = os.path.splitext(file.filename)[1].lower()
            
            if file_extension not in [".pdf", ".docx", ".doc"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file format. Supported: PDF, DOCX, DOC"
                )
            
            # Save uploaded file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
                content = await file.read()
                tmp_file.write(content)
                tmp_path = tmp_file.name
            
            try:
                resume_text = resume_extractor.extract_from_file(tmp_path)
            finally:
                os.unlink(tmp_path)
        
        # Validate resume content
        if not validate_resume_content(resume_text):
            raise HTTPException(
                status_code=400,
                detail="Resume is too short or missing key sections. Minimum 500 characters required."
            )
        
        # Analyze JD match
        result = jd_analyzer.analyze(resume_text, jd_text)
        
        return format_response("success", result)
    
    except HTTPException:
        raise
    except Exception as e:
        return format_response("error", error=str(e)), 500


@app.post("/api/compare-jds")
async def compare_multiple_jds(
    file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    jd_texts: Optional[List[str]] = Form(None)
):
    """
    Compare resume against multiple job descriptions.
    
    Provide list of job descriptions to find the best match.
    Returns all matches sorted by score.
    """
    try:
        # Validate input
        if not jd_texts or len(jd_texts) == 0:
            raise HTTPException(
                status_code=400,
                detail="At least one job description is required"
            )
        
        if not file and not resume_text:
            raise HTTPException(
                status_code=400,
                detail="Either 'file' or 'resume_text' must be provided"
            )
        
        # Extract resume text
        if file:
            file_extension = os.path.splitext(file.filename)[1].lower()
            
            if file_extension not in [".pdf", ".docx", ".doc"]:
                raise HTTPException(
                    status_code=400,
                    detail="Unsupported file format. Supported: PDF, DOCX, DOC"
                )
            
            # Save uploaded file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
                content = await file.read()
                tmp_file.write(content)
                tmp_path = tmp_file.name
            
            try:
                resume_text = resume_extractor.extract_from_file(tmp_path)
            finally:
                os.unlink(tmp_path)
        
        # Validate resume content
        if not validate_resume_content(resume_text):
            raise HTTPException(
                status_code=400,
                detail="Resume is too short or missing key sections. Minimum 500 characters required."
            )
        
        # Validate all JDs
        for jd in jd_texts:
            if len(jd.strip()) < 200:
                raise HTTPException(
                    status_code=400,
                    detail="All job descriptions must be at least 200 characters"
                )
        
        # Analyze multiple JDs
        result = jd_analyzer.compare_multiple_jds(resume_text, jd_texts)
        
        return format_response("success", result)
    
    except HTTPException:
        raise
    except Exception as e:
        return format_response("error", error=str(e)), 500


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content=format_response("error", error=exc.detail)
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions."""
    return JSONResponse(
        status_code=500,
        content=format_response("error", error="Internal server error: " + str(exc))
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)