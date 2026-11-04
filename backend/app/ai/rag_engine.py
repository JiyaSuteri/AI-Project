import os
import glob
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class PolicyChunk:
    def __init__(self, doc_name: str, title: str, content: str):
        self.doc_name = doc_name
        self.title = title
        self.content = content

class RAGEngine:
    """
    RAG Engine for Restaurant Policies.
    Loads policy documents, chunks them by sections, indexes using TF-IDF,
    and performs semantic retrieval with cosine similarity.
    """
    def __init__(self, policies_dir: str = "data/policies"):
        self.policies_dir = policies_dir
        self.chunks: List[PolicyChunk] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix = None
        self.load_and_index()

    def load_and_index(self):
        self.chunks = []
        # Find policy directory
        search_paths = [
            self.policies_dir,
            os.path.join("..", self.policies_dir),
            os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "policies")
        ]
        
        target_dir = None
        for p in search_paths:
            if os.path.exists(p) and os.path.isdir(p):
                target_dir = p
                break

        if not target_dir:
            # Fallback inline policies if folder not mounted
            self.chunks.append(PolicyChunk(
                doc_name="table_allocation_policy.md",
                title="Capacity Fit Principle",
                content="Customer groups must be allocated to tables that have a seating capacity equal to or greater than the group size. The smallest suitable table is always prioritized."
            ))
            return

        md_files = glob.glob(os.path.join(target_dir, "*.md"))
        for file_path in md_files:
            doc_name = os.path.basename(file_path)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read()

                # Chunk by markdown headers (## )
                sections = text.split("## ")
                main_title = sections[0].replace("# ", "").strip() if sections else doc_name

                for section in sections[1:]:
                    lines = section.strip().split("\n")
                    sec_title = lines[0].strip()
                    sec_body = "\n".join(lines[1:]).strip()
                    if sec_body:
                        self.chunks.append(PolicyChunk(
                            doc_name=doc_name,
                            title=f"{main_title} > {sec_title}",
                            content=sec_body
                        ))
            except Exception as e:
                print(f"Error reading {file_path}: {e}")

        # Index chunks with TF-IDF
        if self.chunks:
            corpus = [f"{c.title} {c.content}" for c in self.chunks]
            self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
            self.tfidf_matrix = self.vectorizer.fit_transform(corpus)

    def retrieve(self, query: str, top_k: int = 3) -> List[Tuple[PolicyChunk, float]]:
        if not self.chunks or self.vectorizer is None or self.tfidf_matrix is None:
            return []

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        top_indices = similarities.argsort()[::-1][:top_k]
        results = []
        for idx in top_indices:
            score = float(similarities[idx])
            if score > 0.05: # Only return somewhat relevant matches
                results.append((self.chunks[idx], round(score, 3)))
        return results

# Global RAG instance
rag_engine = RAGEngine()
