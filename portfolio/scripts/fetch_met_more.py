#!/usr/bin/env python3
import json, os, ssl, urllib.request, urllib.parse, sys

BASE = "https://collectionapi.metmuseum.org/public/collection/v1"
OUTDIR = os.path.join(os.path.dirname(__file__), "..", "assets", "art", "masters")
MANIFEST = os.path.join(OUTDIR, 'masters.json')
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

def main(limit=6):
    try:
        with open(MANIFEST,'r') as f: items = json.load(f)
    except Exception:
        items = []
    seen_imgs = { os.path.basename(it.get('image','')) for it in items }
    seen_urls = { it.get('url') for it in items if it.get('url') }
    data = get(f"{BASE}/search?hasImages=true&isPublicDomain=true&departmentId=11&q=painting")
    ids = data.get('objectIDs') or []
    added = 0
    for oid in ids:
        if added >= limit: break
        try:
            obj = get(f"{BASE}/objects/{oid}")
            img = obj.get('primaryImageSmall') or obj.get('primaryImage')
            if not img: continue
            filename = f"met_{oid}.jpg"
            if filename in seen_imgs: continue
            url = obj.get('objectURL') or ''
            if url and url in seen_urls: continue
            download(img, os.path.join(OUTDIR, filename))
            items.append({
                'title': obj.get('title') or 'Artwork',
                'artist': obj.get('artistDisplayName') or 'Unknown',
                'year': obj.get('objectDate') or '',
                'image': f'assets/art/masters/{filename}',
                'url': url
            })
            seen_imgs.add(filename); seen_urls.add(url)
            added += 1
        except Exception:
            continue
    with open(MANIFEST, 'w') as f: json.dump(items, f, indent=2)
    print(f"Added {added} MET items; total {len(items)}")

if __name__ == '__main__':
    sys.exit(main())
