import re
from typing import List, Set

# Comprehensive skill database with aliases/variants
SKILL_DATABASE = {
    # Programming Languages
    "Python": ["python", "python3"],
    "Java": ["java"],
    "JavaScript": ["javascript", "js"],
    "TypeScript": ["typescript", "ts"],
    "C++": ["c++", "cpp"],
    "C#": ["c#", "csharp", "c sharp"],
    "Go": ["golang", "go lang"],
    "Rust": ["rust"],
    "Ruby": ["ruby"],
    "PHP": ["php"],
    "Swift": ["swift"],
    "Kotlin": ["kotlin"],
    "Scala": ["scala"],
    "R": ["\\br\\b"],
    "MATLAB": ["matlab"],
    # Web Frontend
    "React": ["react", "reactjs", "react.js"],
    "Angular": ["angular", "angularjs"],
    "Vue.js": ["vue", "vuejs", "vue.js"],
    "Next.js": ["next.js", "nextjs"],
    "HTML": ["html", "html5"],
    "CSS": ["css", "css3"],
    "Tailwind CSS": ["tailwind", "tailwindcss"],
    "Bootstrap": ["bootstrap"],
    "Sass": ["sass", "scss"],
    "jQuery": ["jquery"],
    "Svelte": ["svelte"],
    # Web Backend
    "Node.js": ["node.js", "nodejs", "node"],
    "Express.js": ["express", "expressjs", "express.js"],
    "Django": ["django"],
    "Flask": ["flask"],
    "FastAPI": ["fastapi", "fast api"],
    "Spring Boot": ["spring boot", "springboot", "spring"],
    "ASP.NET": ["asp.net", "aspnet"],
    "Ruby on Rails": ["rails", "ruby on rails"],
    "Laravel": ["laravel"],
    # Databases
    "SQL": ["sql"],
    "PostgreSQL": ["postgresql", "postgres"],
    "MySQL": ["mysql"],
    "MongoDB": ["mongodb", "mongo"],
    "Redis": ["redis"],
    "SQLite": ["sqlite"],
    "Oracle": ["oracle"],
    "Cassandra": ["cassandra"],
    "Elasticsearch": ["elasticsearch", "elastic search"],
    "DynamoDB": ["dynamodb"],
    # Cloud & DevOps
    "AWS": ["aws", "amazon web services"],
    "Azure": ["azure", "microsoft azure"],
    "GCP": ["gcp", "google cloud", "google cloud platform"],
    "Docker": ["docker"],
    "Kubernetes": ["kubernetes", "k8s"],
    "Terraform": ["terraform"],
    "Ansible": ["ansible"],
    "Jenkins": ["jenkins"],
    "CI/CD": ["ci/cd", "cicd", "ci cd"],
    "GitHub Actions": ["github actions"],
    "GitLab CI": ["gitlab ci"],
    "Linux": ["linux", "ubuntu", "centos", "debian"],
    "Nginx": ["nginx"],
    # AI/ML
    "Machine Learning": ["machine learning", "ml"],
    "Deep Learning": ["deep learning", "dl"],
    "TensorFlow": ["tensorflow"],
    "PyTorch": ["pytorch"],
    "Keras": ["keras"],
    "Scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
    "NLP": ["nlp", "natural language processing"],
    "Computer Vision": ["computer vision", "cv"],
    "OpenCV": ["opencv"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "Hugging Face": ["hugging face", "huggingface"],
    # Data
    "Apache Spark": ["spark", "apache spark", "pyspark"],
    "Hadoop": ["hadoop"],
    "Kafka": ["kafka", "apache kafka"],
    "Airflow": ["airflow", "apache airflow"],
    "ETL": ["etl"],
    "Data Engineering": ["data engineering"],
    "Power BI": ["power bi", "powerbi"],
    "Tableau": ["tableau"],
    # Tools & Others
    "Git": ["git"],
    "REST API": ["rest api", "restful", "rest"],
    "GraphQL": ["graphql"],
    "gRPC": ["grpc"],
    "Microservices": ["microservices", "micro services"],
    "Agile": ["agile", "scrum"],
    "Jira": ["jira"],
    "DevOps": ["devops", "dev ops"],
    "System Design": ["system design"],
    "Data Structures": ["data structures"],
    "Algorithms": ["algorithms"],
    "Unit Testing": ["unit testing", "unit tests"],
    "Figma": ["figma"],
    "Webpack": ["webpack"],
}


def extract_skills(text: str) -> List[str]:
    """Extract skills from text by matching against the skill database."""
    text_lower = text.lower()
    found_skills: Set[str] = set()

    for skill_name, aliases in SKILL_DATABASE.items():
        for alias in aliases:
            # Use word boundary matching for short aliases
            if len(alias) <= 2:
                pattern = r"\b" + re.escape(alias) + r"\b"
                if re.search(pattern, text_lower):
                    found_skills.add(skill_name)
                    break
            else:
                if alias in text_lower:
                    found_skills.add(skill_name)
                    break

    return sorted(list(found_skills))


def get_all_skills() -> List[str]:
    """Return all skill names in the database."""
    return sorted(SKILL_DATABASE.keys())


def find_matching_skills(candidate_skills: List[str], required_skills: List[str]) -> dict:
    """Find matched and missing skills between candidate and job requirements."""
    candidate_set = {s.lower() for s in candidate_skills}
    required_set = {s.lower() for s in required_skills}

    # Map normalized back to original case
    required_map = {s.lower(): s for s in required_skills}

    matched = []
    missing = []

    for req_lower, req_original in required_map.items():
        if req_lower in candidate_set:
            matched.append(req_original)
        else:
            missing.append(req_original)

    total = len(required_skills)
    score = (len(matched) / total * 100) if total > 0 else 0

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "skill_match_score": round(score, 2),
    }
