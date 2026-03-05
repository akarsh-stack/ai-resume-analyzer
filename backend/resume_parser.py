import re
import pdfplumber
from docx import Document
import spacy
from typing import Optional

nlp = None


def get_nlp():
    global nlp
    if nlp is None:
        try:
            nlp = spacy.load("en_core_web_sm")
        except OSError:
            from spacy.cli import download
            download("en_core_web_sm")
            nlp = spacy.load("en_core_web_sm")
    return nlp


def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


def extract_text_from_docx(file_path: str) -> str:
    doc = Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])


def extract_text(file_path: str) -> str:
    lower = file_path.lower()
    if lower.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif lower.endswith(".docx"):
        return extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_path}")


def extract_email(text: str) -> Optional[str]:
    pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    match = re.search(pattern, text)
    return match.group(0) if match else None


def extract_name(text: str) -> Optional[str]:
    doc = get_nlp()(text[:500])
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    lines = text.strip().split("\n")
    for line in lines[:3]:
        line = line.strip()
        if line and not re.search(r"@|http|www|\d{5,}", line) and len(line.split()) <= 5:
            return line
    return None


def extract_education(text: str) -> str:
    education_keywords = [
        r"education", r"academic", r"qualification", r"degree",
        r"university", r"college", r"school", r"bachelor", r"master",
        r"ph\.?d", r"b\.?tech", r"m\.?tech", r"b\.?sc", r"m\.?sc",
        r"b\.?e\b", r"m\.?e\b", r"mba", r"bca", r"mca",
    ]
    lines = text.split("\n")
    education_lines = []
    capturing = False
    section_headers = [
        r"experience", r"skills", r"projects", r"certifications",
        r"achievements", r"summary", r"objective", r"interests",
    ]

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        if any(re.search(kw, stripped, re.IGNORECASE) for kw in education_keywords):
            capturing = True
            education_lines.append(stripped)
            continue
        if capturing:
            if any(re.search(sh, stripped, re.IGNORECASE) for sh in section_headers):
                break
            education_lines.append(stripped)

    return "\n".join(education_lines) if education_lines else ""


def extract_experience(text: str) -> str:
    experience_keywords = [
        r"experience", r"work\s*history", r"employment",
        r"professional\s*background", r"career",
    ]
    lines = text.split("\n")
    experience_lines = []
    capturing = False
    section_headers = [
        r"education", r"skills", r"projects", r"certifications",
        r"achievements", r"summary", r"objective", r"interests",
    ]

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        if any(re.search(kw, stripped, re.IGNORECASE) for kw in experience_keywords):
            capturing = True
            experience_lines.append(stripped)
            continue
        if capturing:
            if any(re.search(sh, stripped, re.IGNORECASE) for sh in section_headers):
                break
            experience_lines.append(stripped)

    return "\n".join(experience_lines) if experience_lines else ""


def parse_resume(file_path: str) -> dict:
    raw_text = extract_text(file_path)
    return {
        "raw_text": raw_text,
        "name": extract_name(raw_text),
        "email": extract_email(raw_text),
        "education": extract_education(raw_text),
        "experience": extract_experience(raw_text),
    }
