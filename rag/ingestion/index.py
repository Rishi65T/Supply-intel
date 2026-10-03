"""
Local RAG Document Chunking and Vector Indexing Engine for SUPPLYINTEL.
Processes supply-chain SOPs, policy guidelines, and corridor manuals into chunk embeddings
stored in a zero-dependency local vector store. No external API keys required.
"""
import sys
import os
import json
import re
from pathlib import Path
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

DOCS_DIR = BASE_DIR / "rag" / "documents"
INDEX_PATH = BASE_DIR / "rag" / "vector_store.json"

def chunk_text(text: str, max_chunk_size: int = 400, overlap: int = 50) -> list:
    """Splits markdown text into coherent semantic paragraphs/sections."""
    sections = re.split(r'\n(?=#{1,3} )', text)
    chunks = []
    for sec in sections:
        sec = sec.strip()
        if not sec:
            continue
        if len(sec) <= max_chunk_size:
            chunks.append(sec)
        else:
            # Split by paragraphs
            paragraphs = sec.split("\n\n")
            current = ""
            for p in paragraphs:
                if len(current) + len(p) < max_chunk_size:
                    current += "\n\n" + p if current else p
                else:
                    if current:
                        chunks.append(current.strip())
                    current = p
            if current:
                chunks.append(current.strip())
    return chunks

def build_vector_index():
    print("=" * 70)
    print("      SUPPLYINTEL LOCAL RAG INDEXING ENGINE (NO API KEYS)")
    print("=" * 70)

    doc_files = list(DOCS_DIR.glob("*.md")) + list(DOCS_DIR.glob("*.txt"))
    if not doc_files:
        print(f"[RAG] No documents found in {DOCS_DIR}")
        return False

    all_chunks = []
    chunk_metadata = []

    for file_path in doc_files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        file_chunks = chunk_text(content)
        print(f"[RAG] Processed {file_path.name}: {len(file_chunks)} chunks extracted.")

        for idx, chunk in enumerate(file_chunks):
            chunk_id = f"{file_path.stem}_chk_{idx}"
            all_chunks.append(chunk)
            chunk_metadata.append({
                "chunk_id": chunk_id,
                "source": file_path.name,
                "text": chunk
            })

    # Local TF-IDF Dense Embedding vectorizer (runs 100% locally with zero external network calls)
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english", max_features=1024)
    X = vectorizer.fit_transform(all_chunks).toarray()

    # Save to local vector store
    vocab_serializable = {k: int(v) for k, v in vectorizer.vocabulary_.items()}
    store = {
        "vocabulary": vocab_serializable,
        "idf": vectorizer.idf_.tolist(),
        "chunks": [
            {
                "chunk_id": chunk_metadata[i]["chunk_id"],
                "source": chunk_metadata[i]["source"],
                "text": chunk_metadata[i]["text"],
                "embedding": X[i].tolist()
            }
            for i in range(len(all_chunks))
        ],
        "total_chunks": len(all_chunks)
    }

    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2)

    print(f"\n[OK] Local Vector Store successfully built with {len(all_chunks)} chunks.")
    print(f"     Target: {INDEX_PATH}")
    return True

if __name__ == "__main__":
    build_vector_index()
