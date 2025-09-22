
from typing import List, Set, Tuple, Dict
import pandas as pd

def load_cocktails(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    df["ingredients_list"] = df["ingredients"].str.split(",").apply(lambda x: [i.strip().lower() for i in x])
    df["taste_list"] = df["taste_tags"].str.split(",").apply(lambda x: [t.strip().lower() for t in x])
    return df

def score_row(row, have_set: Set[str], taste_set: Set[str], abv_min: int, abv_max: int) -> float:
    ing = set(row["ingredients_list"])
    taste_tags = set(row["taste_list"])

    # Ingredient coverage score
    ing_score = 0.5 if not have_set else (len(ing & have_set) / max(1, len(ing)))

    # Taste match score
    if not taste_set:
        taste_score = 0.5
    else:
        taste_score = len(taste_tags & taste_set) / max(1, len(taste_set))

    # ABV score
    abv = int(row["abv"])
    if abv < abv_min:
        abv_score = max(0.0, 1 - (abv_min - abv) / 10)
    elif abv > abv_max:
        abv_score = max(0.0, 1 - (abv - abv_max) / 10)
    else:
        abv_score = 1.0

    return round(0.5*ing_score + 0.3*taste_score + 0.2*abv_score, 4)
