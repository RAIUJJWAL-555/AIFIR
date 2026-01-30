from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import json

app = FastAPI()

model = SentenceTransformer("all-MiniLM-L6-v2")

with open("answers.json", "r", encoding="utf-8") as f:
    data = json.load(f)

questions = []
answers = []

for item in data:
    for q in item["questions"]:
        questions.append(q)
        answers.append(item["answer"])

question_embeddings = model.encode(questions)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(req: ChatRequest):
    query_embedding = model.encode(req.message)
    scores = util.cos_sim(query_embedding, question_embeddings)
    best_index = int(scores.argmax())
    best_score = float(scores[0][best_index])

    if best_score < 0.25:
        return {"reply": "Maaf kijiye, main samajh nahi paaya. Kripya thoda aur vistaar mein batayein ya FIR se jude sawaal puchein."}

    return {"reply": answers[best_index]}
