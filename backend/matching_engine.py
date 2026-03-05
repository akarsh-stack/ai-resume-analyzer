import numpy as np
from typing import List, Optional
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import faiss
from skill_extractor import find_matching_skills

_model: Optional[SentenceTransformer] = None
_faiss_index: Optional[faiss.IndexFlatIP] = None
_faiss_resume_ids: List[int] = []

EMBEDDING_DIM = 384  # all-MiniLM-L6-v2 output dimension


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def generate_embedding(text: str) -> List[float]:
    model = get_model()
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()


def compute_semantic_similarity(text_a: str, text_b: str) -> float:
    model = get_model()
    embeddings = model.encode([text_a, text_b], normalize_embeddings=True)
    sim = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return max(0.0, float(sim)) * 100  # Return as percentage


def compute_match_score(
    candidate_skills: List[str],
    required_skills: List[str],
    resume_text: str,
    job_description: str,
    skill_weight: float = 0.6,
    semantic_weight: float = 0.4,
) -> dict:
    """Compute a combined match score from skill overlap and semantic similarity."""
    # Skill-based matching
    skill_result = find_matching_skills(candidate_skills, required_skills)
    skill_score = skill_result["skill_match_score"]

    # Semantic similarity
    semantic_score = compute_semantic_similarity(resume_text, job_description)

    # Combined score
    overall = round(skill_weight * skill_score + semantic_weight * semantic_score, 2)

    return {
        "overall_score": overall,
        "skill_match_score": skill_score,
        "semantic_score": round(semantic_score, 2),
        "matched_skills": skill_result["matched_skills"],
        "missing_skills": skill_result["missing_skills"],
    }


# ──────────── FAISS Vector Search ────────────

def build_faiss_index(embeddings: List[List[float]], resume_ids: List[int]):
    """Build or rebuild the FAISS index from all resume embeddings."""
    global _faiss_index, _faiss_resume_ids

    if not embeddings:
        _faiss_index = None
        _faiss_resume_ids = []
        return

    arr = np.array(embeddings, dtype=np.float32)
    faiss.normalize_L2(arr)

    index = faiss.IndexFlatIP(EMBEDDING_DIM)
    index.add(arr)

    _faiss_index = index
    _faiss_resume_ids = resume_ids


def search_similar_resumes(query_text: str, top_k: int = 10) -> List[dict]:
    """Search for resumes semantically similar to the query."""
    global _faiss_index, _faiss_resume_ids

    if _faiss_index is None or _faiss_index.ntotal == 0:
        return []

    model = get_model()
    query_vec = model.encode([query_text], normalize_embeddings=True).astype(np.float32)

    k = min(top_k, _faiss_index.ntotal)
    scores, indices = _faiss_index.search(query_vec, k)

    results = []
    for score, idx in zip(scores[0], indices[0]):
        if idx < len(_faiss_resume_ids):
            results.append({
                "resume_id": _faiss_resume_ids[idx],
                "similarity_score": round(float(score) * 100, 2),
            })

    return results
