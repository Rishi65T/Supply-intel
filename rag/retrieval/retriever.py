"""
Local Vector Retriever for SUPPLYINTEL RAG.
Computes cosine similarity against local vector index without any external network calls.
"""
import sys
import json
from pathlib import Path
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

INDEX_PATH = BASE_DIR / "rag" / "vector_store.json"

class LocalRetriever:
    def __init__(self):
        self.store = None
        self.vectorizer = None
        self._load()

    def _load(self):
        if not INDEX_PATH.exists():
            from rag.ingestion.index import build_vector_index
            build_vector_index()

        with open(INDEX_PATH, "r", encoding="utf-8") as f:
            self.store = json.load(f)

        vocab = self.store["vocabulary"]
        idf = np.array(self.store["idf"])

        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english", max_features=1024)
        self.vectorizer.vocabulary_ = vocab
        self.vectorizer.idf_ = idf

    def search(self, query: str, top_k: int = 3) -> list:
        if not self.store or not self.store.get("chunks") or not self.vectorizer:
            return []

        q_vec = self.vectorizer.transform([query]).toarray()[0]
        q_norm = np.linalg.norm(q_vec)
        if q_norm == 0:
            return self.store["chunks"][:top_k]

        results = []
        for chunk in self.store["chunks"]:
            c_vec = np.array(chunk["embedding"])
            c_norm = np.linalg.norm(c_vec)
            sim = 0.0
            if c_norm > 0:
                sim = float(np.dot(q_vec, c_vec) / (q_norm * c_norm))

            results.append({
                "chunk_id": chunk["chunk_id"],
                "source": chunk["source"],
                "text": chunk["text"],
                "similarity": round(sim, 4)
            })

        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:top_k]

if __name__ == "__main__":
    retriever = LocalRetriever()
    hits = retriever.search("monsoon landslide on NH48 and DFC rail rerouting", top_k=2)
    print("\n[RAG SEARCH TEST]")
    for h in hits:
        print(f"  [{h['source']} | sim: {h['similarity']}] {h['text'][:120]}...")
