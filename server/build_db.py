#!/usr/bin/env python3
import json, sqlite3, sys, os
from typing import Dict, Any

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'scripts', 'data', 'words.jsonl')
DB_PATH = os.path.join(BASE_DIR, 'ipa_en.sqlite')

US_TAGS = {'US', 'American', 'GA', 'en-us'}
GB_TAGS = {'UK', 'Britain', 'RP', 'en-gb', 'Oxford'}


def side_from_tags(tags):
    if not tags:
        return None
    tset = {str(t) for t in tags}
    if tset & US_TAGS:
        return 'us'
    if tset & GB_TAGS:
        return 'gb'
    return None


def main():
    if not os.path.exists(DATA_PATH):
        print(f"Input not found: {DATA_PATH}\nRun scripts/download_kaikki.sh first.")
        sys.exit(1)

    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("PRAGMA journal_mode=WAL")
    cur.execute("CREATE TABLE IF NOT EXISTS ipa(word TEXT PRIMARY KEY, us TEXT, gb TEXT)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_word ON ipa(word)")

    seen: Dict[str, Dict[str, str]] = {}
    count = 0
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        for line in f:
            count += 1
            if count % 200000 == 0:
                print(f"Processed {count} lines...")
            try:
                o: Dict[str, Any] = json.loads(line)
            except Exception:
                continue
            if o.get('lang') != 'English':
                continue
            w = o.get('word')
            if not w:
                continue
            k = w.lower()
            for s in (o.get('sounds') or []):
                ipa = s.get('ipa')
                if not ipa:
                    continue
                side = side_from_tags(s.get('tags'))
                if k not in seen:
                    seen[k] = {}
                if side == 'us':
                    seen[k]['us'] = seen[k].get('us') or ipa
                elif side == 'gb':
                    seen[k]['gb'] = seen[k].get('gb') or ipa
                else:
                    # fallback: if neither tagged, treat as gb unless us exists
                    seen[k]['gb'] = seen[k].get('gb') or ipa

    rows = [(k, v.get('us'), v.get('gb')) for k, v in seen.items()]
    cur.executemany("INSERT OR REPLACE INTO ipa(word, us, gb) VALUES (?,?,?)", rows)
    con.commit()
    con.close()
    print(f"Built DB at {DB_PATH} with {len(rows)} entries.")


if __name__ == '__main__':
    main()
