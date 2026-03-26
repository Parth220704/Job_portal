from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
model = SentenceTransformer("all-MiniLM-L6-v2")


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/embed")
def embed():
    payload = request.get_json(silent=True) or {}
    texts = payload.get("texts", [])

    if not isinstance(texts, list):
        return jsonify({"message": "texts must be an array"}), 400

    safe_texts = [str(t or "")[:12000] for t in texts]

    if len(safe_texts) == 0:
        return jsonify({"embeddings": []})

    vectors = model.encode(
        safe_texts,
        normalize_embeddings=True,
        convert_to_numpy=True
    )

    return jsonify({"embeddings": vectors.tolist()})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001, debug=False)
