#!/usr/bin/env python3
import json, os, sys

OUTDIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'art', 'masters')
MANIFEST = os.path.join(OUTDIR, 'masters.json')

def main():
    with open(MANIFEST,'r') as f: items = json.load(f)
    seen = set(); out = []
    for it in items:
        key = it.get('url') or it.get('image')
        if key and key in seen: continue
        seen.add(key)
        out.append(it)
    with open(MANIFEST,'w') as f: json.dump(out, f, indent=2)
    print(f"Deduped {len(items)} -> {len(out)}")

if __name__ == '__main__':
    sys.exit(main())

