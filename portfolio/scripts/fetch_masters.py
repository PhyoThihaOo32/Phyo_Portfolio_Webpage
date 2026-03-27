#!/usr/bin/env python3
"""
Fetch 8 public‑domain paintings from The Met Collection API and store them
under assets/art/masters with a masters.json manifest. Requires internet.
"""
import json, os, sys, urllib.request, ssl

BASE = "https://collectionapi.metmuseum.org/public/collection/v1"
OUTDIR = os.path.join(os.path.dirname(__file__), "..", "assets", "art", "masters")
os.makedirs(OUTDIR, exist_ok=True)

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

def get(url):
    with urllib.request.urlopen(url, context=CTX) as r:
        return json.load(r)

def download(url, path):
    with urllib.request.urlopen(url, context=CTX) as r, open(path, 'wb') as f:
        f.write(r.read())

def main():
    q = urllib.parse.quote("painting")
    url = f"{BASE}/search?hasImages=true&isPublicDomain=true&departmentId=11&q={q}"
    data = get(url)
    ids = (data.get('objectIDs') or [])[:50]
    if not ids:
        print("No ids found", file=sys.stderr)
        return 1
    items = []
    for oid in ids:
        try:
            obj = get(f"{BASE}/objects/{oid}")
            if not obj.get('isPublicDomain'): continue
            img = obj.get('primaryImageSmall') or obj.get('primaryImage')
            if not img: continue
            name = f"{oid}.jpg"
            download(img, os.path.join(OUTDIR, name))
            items.append({
                'title': obj.get('title') or 'Artwork',
                'artist': obj.get('artistDisplayName') or 'Unknown',
                'year': obj.get('objectDate') or '',
                'image': f"assets/art/masters/{name}",
                'url': obj.get('objectURL') or ''
            })
            if len(items) >= 8: break
        except Exception as e:
            continue
    with open(os.path.join(OUTDIR, 'masters.json'), 'w') as f:
        json.dump(items, f, indent=2)
    print(f"Wrote {len(items)} items to masters.json")

if __name__ == '__main__':
    sys.exit(main())
