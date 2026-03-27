#!/usr/bin/env python3
"""
Append public‑domain masterpieces from additional open museums to masters.json.

Sources supported:
- Art Institute of Chicago (AIC) — no API key required
- Rijksmuseum — requires RIJKSMUSEUM_API_KEY env var (imgonly)

Writes images to assets/art/masters and updates masters.json in same folder.
"""
import json, os, ssl, urllib.request, urllib.parse, sys

BASE_DIR = os.path.dirname(__file__)
OUTDIR = os.path.join(BASE_DIR, '..', 'assets', 'art', 'masters')
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

def load_manifest():
    try:
        with open(MANIFEST, 'r') as f: return json.load(f)
    except Exception:
        return []

def save_manifest(items):
    with open(MANIFEST, 'w') as f: json.dump(items, f, indent=2)

def add_item(items, title, artist, year, image_path, url):
    if any(it.get('image') == image_path for it in items):
        return False
    items.append({
        'title': title or 'Artwork',
        'artist': artist or 'Unknown',
        'year': year or '',
        'image': image_path,
        'url': url or ''
    })
    return True

def fetch_aic(limit=8):
    print('Fetching AIC…', file=sys.stderr)
    # Pull a page of artworks and filter in code for public domain with image
    url = 'https://api.artic.edu/api/v1/artworks?is_public_domain=true&limit=80&fields=id,title,artist_display,date_display,image_id,is_public_domain'
    data = get(url)
    items = []
    for d in data.get('data', []):
        if not d.get('is_public_domain'): continue
        iid = d.get('image_id')
        if not iid: continue
        img = f'https://www.artic.edu/iiif/2/{iid}/full/843,/0/default.jpg'
        path = os.path.join(OUTDIR, f'aic_{d.get("id")}.jpg')
        try:
            download(img, path)
            items.append({
                'title': d.get('title'),
                'artist': d.get('artist_display'),
                'year': d.get('date_display'),
                'image': f'assets/art/masters/{os.path.basename(path)}',
                'url': f'https://www.artic.edu/artworks/{d.get("id")}'
            })
            if len(items) >= limit: break
        except Exception:
            continue
    return items

def fetch_rijks(limit=8):
    key = os.environ.get('RIJKSMUSEUM_API_KEY')
    if not key:
        print('RIJKSMUSEUM_API_KEY not set; skipping Rijksmuseum', file=sys.stderr)
        return []
    print('Fetching Rijksmuseum…', file=sys.stderr)
    # English collection, paintings, images only
    url = f'https://www.rijksmuseum.nl/api/en/collection?key={key}&imgonly=True&type=painting&p=1&ps=100'
    data = get(url)
    results = []
    for obj in data.get('artObjects', []):
        web = obj.get('webImage', {})
        img = web.get('url')
        if not img: continue
        rid = obj.get('objectNumber', obj.get('id', 'item'))
        path = os.path.join(OUTDIR, f'rijks_{rid}.jpg')
        try:
            download(img, path)
            results.append({
                'title': obj.get('title'),
                'artist': obj.get('principalOrFirstMaker'),
                'year': obj.get('dating', {}).get('presentingDate', ''),
                'image': f'assets/art/masters/{os.path.basename(path)}',
                'url': obj.get('links', {}).get('web', '')
            })
            if len(results) >= limit: break
        except Exception:
            continue
    return results

def main():
    items = load_manifest()
    added = 0
    for it in fetch_aic(limit=8):
        if add_item(items, it['title'], it['artist'], it['year'], it['image'], it['url']):
            added += 1
    for it in fetch_rijks(limit=6):
        if add_item(items, it['title'], it['artist'], it['year'], it['image'], it['url']):
            added += 1
    save_manifest(items)
    print(f'Added {added} items; total now {len(items)}')

if __name__ == '__main__':
    sys.exit(main())
