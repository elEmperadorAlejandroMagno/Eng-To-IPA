from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import re
from typing import Optional

DB_PATH = __file__.replace('main.py', 'ipa_en.sqlite')

app = FastAPI(title="IPA Transcription API")

# CORS for local dev (adjust origins in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscribeRequest(BaseModel):
    text: str
    accent: str = "american"  # 'american' | 'rp'
    useWeakForms: bool = True
    ignoreStress: bool = False
    applySimplification: bool = False  # placeholder, not applied yet

WEAK_DICT = {
    'is': {'strong': 'ɪz', 'weak': 's'},
    'are': {'strong': 'ɑː', 'weak': 'ə'},
    'am': {'strong': 'æm', 'weak': 'əm'},
    'have': {'strong': 'hæv', 'weak': 'əv'},
    'has': {'strong': 'hæz', 'weak': 'əz'},
    'had': {'strong': 'hæd', 'weak': 'əd'},
    'do': {'strong': 'duː', 'weak': 'də'},
    'to': {'strong': 'tuː', 'weak': 'tə'},
    'of': {'strong': 'ɒv', 'weak': 'əv'},
    'and': {'strong': 'ænd', 'weak': 'ən'},
    'the': {'strong': 'ðə', 'weak': 'ðə'},
}

PUNCT_RE = re.compile(r"^[.,!?;:'-]+$")


def db_lookup(word: str, accent: str) -> Optional[str]:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT us, gb FROM ipa WHERE word=?", (word.lower(),))
    row = cur.fetchone()
    conn.close()
    if not row:
        return None
    us, gb = row
    if accent == 'american':
        return us or gb
    return gb or us


def should_use_weak(word: str, idx: int, words: list[str]) -> bool:
    w = re.sub(r"[^\w']", '', word.lower())
    if w in ('i', 'my', 'may', 'might', 'ought', 'by', 'so', 'while'):
        return False
    if "'" in w:
        return False
    if idx == 0 and w not in ('the', 'a', 'an', 'there'):
        return False
    if idx == len(words) - 1:
        return False
    if idx < len(words) - 1 and PUNCT_RE.match(words[idx+1] or ''):
        return False
    return True


def transcribe_text(text: str, accent: str, use_weak: bool, ignore_stress: bool) -> str:
    tokens = re.findall(r"\b\w+'\w+\b|\b\w+\b|[.,!?;:'-]", text) or []
    out: list[str] = []
    for i, tok in enumerate(tokens):
        if PUNCT_RE.match(tok):
            out.append(tok)
            continue
        key = tok.lower()
        # weak forms
        if use_weak and key in WEAK_DICT and should_use_weak(tok, i, tokens):
            ipa = WEAK_DICT[key]['weak']
            out.append(ipa)
            continue
        # db
        ipa = db_lookup(tok, accent)
        out.append(ipa or tok)
    result = ' '.join(out)
    result = re.sub(r"\s+([.,!?;:'-])", r"\1", result)
    if ignore_stress:
        result = result.replace('ˈ', '').replace('ˌ', '')
    return result.strip()


@app.get("/ipa")
def get_ipa(word: str = Query(...), accent: str = "american"):
    ipa = db_lookup(word, 'american' if accent.lower().startswith('us') or accent == 'american' else 'rp')
    return {"word": word, "ipa": ipa, "accent": accent}


@app.post("/transcribe")
def post_transcribe(req: TranscribeRequest):
    accent = 'american' if req.accent.lower().startswith('a') else 'rp'
    result = transcribe_text(req.text, accent, req.useWeakForms, req.ignoreStress)
    return {"text": req.text, "accent": accent, "ipa": result}
