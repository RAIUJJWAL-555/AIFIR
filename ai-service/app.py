from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from transformers import pipeline
import json

app = FastAPI()

# Semantic Search Model (Existing)
model = SentenceTransformer("all-MiniLM-L6-v2")

# Zero-Shot Classifier (New)
# Using a lighter distilbart model for speed if preferred, but user asked for facebook/bart-large-mnli
# We'll use the requested model. It might download on first run (~1.5GB).
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

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

class ClassificationRequest(BaseModel):
    description: str

@app.post("/chat")
def chat(req: ChatRequest):
    query_embedding = model.encode(req.message)
    scores = util.cos_sim(query_embedding, question_embeddings)
    best_index = int(scores.argmax())
    best_score = float(scores[0][best_index])

    if best_score < 0.25:
        return {"reply": "Maaf kijiye, main samajh nahi paaya. Kripya thoda aur vistaar mein batayein ya FIR se jude sawaal puchein."}

    return {"reply": answers[best_index]}

@app.post("/classify")
def classify(req: ClassificationRequest):
    text = req.description
    
    # 1. Classify Crime Type
    crime_labels = [
      "Theft", "Robbery", "Assault", "Cyber Crime", 
      "Sexual Harassment", "Domestic Violence", "Fraud", 
      "Missing Person", "Murder Attempt"
    ]
    
    crime_result = classifier(text, crime_labels)
    top_crime = crime_result['labels'][0]
    crime_conf = crime_result['scores'][0]

    # 2. Classify Lethality
    lethality_labels = [
      "Non-Violent", "Low Violence", 
      "Violent", "Life Threatening"
    ]
    
    lethality_result = classifier(text, lethality_labels)
    top_lethality = lethality_result['labels'][0]
    lethality_conf = lethality_result['scores'][0]

    return {
        "crimeType": top_crime,
        "crimeConfidence": round(crime_conf, 2),
        "lethality": top_lethality,
        "lethalityConfidence": round(lethality_conf, 2)
    }
