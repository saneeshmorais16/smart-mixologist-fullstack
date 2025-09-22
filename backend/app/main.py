
import random
from typing import List, Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

from app.utils import load_cocktails, score_row

DATA_PATH = "data/cocktails.csv"
df = load_cocktails(DATA_PATH)

app = FastAPI(title="Smart Mixologist — Powered by Saneesh", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Cocktail(BaseModel):
    name: str
    ingredients: str
    taste_tags: str
    abv: int
    instructions: str
    score: float | None = None

@app.get("/api/health")
def health():
    return {"ok": True, "service": "smart-mixologist", "items": len(df)}

@app.get("/api/cocktails", response_model=list[Cocktail])
def list_cocktails(q: Optional[str] = None, limit: int = 50):
    res = df.copy()
    if q:
        q_low = q.lower()
        res = res[
            res["name"].str.lower().str.contains(q_low)
            | res["ingredients"].str.lower().str.contains(q_low)
            | res["taste_tags"].str.lower().str.contains(q_low)
        ]
    res = res.head(limit)
    return res.to_dict(orient="records")

@app.get("/api/recommend", response_model=list[Cocktail])
def recommend(
    have: Optional[str] = Query(None, description="Comma-separated ingredients"),
    taste: Optional[str] = Query(None, description="Comma-separated taste tags"),
    abv_min: int = 0,
    abv_max: int = 30,
    k: int = 6,
):
    have_set = set([x.strip().lower() for x in have.split(",") if x.strip()]) if have else set()
    taste_set = set([x.strip().lower() for x in taste.split(",") if x.strip()]) if taste else set()

    subset = df[(df["abv"] >= abv_min - 5) & (df["abv"] <= abv_max + 5)].copy()
    subset["score"] = subset.apply(lambda r: score_row(r, have_set, taste_set, abv_min, abv_max), axis=1)
    subset = subset.sort_values("score", ascending=False).head(k)
    return subset.to_dict(orient="records")

@app.get("/api/generate")
def generate(base: str = "rum", vibe: str = "refreshing"):
    adjectives = {
        "refreshing": ["Cool", "Minty", "Crisp", "Zesty"],
        "tropical": ["Sunny", "Island", "Palm", "Lagoon"],
        "bitter": ["Scarlet", "Velvet", "Amber", "Garnet"],
        "dessert": ["Silky", "Velour", "Velvet", "Creamcloud"],
        "coffee": ["Midnight", "Espresso", "Mocha", "Roasted"],
        "aromatic": ["Citrus", "Herbal", "Spiced", "Orange Blossom"],
    }
    suffix = ["Fling", "Whisper", "Twist", "Serenade", "Harmony", "Storm"]
    name = f"{random.choice(adjectives.get(vibe, ['Signature']))} {base.title()} {random.choice(suffix)}"

    base_pairs = {
        "rum": ["lime", "pineapple", "mint", "soda water"],
        "vodka": ["cranberry", "lime", "triple sec"],
        "gin": ["campari", "sweet vermouth", "lemon"],
        "tequila": ["lime", "agave", "triple sec"],
        "whiskey": ["lemon", "bitters", "sugar"],
        "no alcohol": ["lemon", "mint", "soda water", "pineapple"],
    }
    picks = base_pairs.get(base, ["lemon", "sugar", "ice"])
    return {
        "name": name,
        "ingredients": f"{base}, " + ", ".join(random.sample(picks, min(3, len(picks)))) + ", ice",
        "instructions": "Shake or stir with ice depending on vibe. Fine strain. Garnish to taste."
    }
