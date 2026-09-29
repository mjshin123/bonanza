"""Rebuild the self-hosted accent font subsets in public/fonts.

Why: the source fonts are large (esamanru ~620KB each as woff, 에이투지체 ~130KB) while the site
only needs part of them. Run this again whenever a headline uses a Hangul syllable that is not in
the subset (it would otherwise fall back to Pretendard for that one glyph).

    python -m pip install --user fonttools brotli
    python scripts/subset-fonts.py [--a2z PATH_TO_에이투지체-5Medium.woff2]

Outputs (referenced from src/styles/page.css):
    public/fonts/esamanru-Light.subset.woff2   Hangul (KS X 1001 2,350 + any used in src) + ASCII + jamo
    public/fonts/esamanru-Medium.digits.woff2  digits, number punctuation and unit words (stat figures)
    public/fonts/A2Z-Medium.latin.woff2        Latin only
"""

import argparse
import glob
import io
import os
import sys
import tempfile
import urllib.request

try:
    from fontTools import subset
    from fontTools.ttLib import TTFont
except ImportError:
    sys.exit("fonttools is missing: python -m pip install --user fonttools brotli")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "fonts")

# 이사만루 (GongGothic) on the noonnu CDN
ESAMANRU = "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/GongGothic{}.woff"

DIGITS = "0123456789,.+-%"
# unit words that sit next to stat figures (1,026조 / 671만 / 9억+ …), drawn in the same Medium
# (also used by src/lib/accentNums.jsx: the syllable right after a number — units and particles)
UNITS = "조억만천백십원건분초시개년월일명곳배위번층차회호대등주세종점은는이가을를의에로도"
ASCII = "".join(chr(c) for c in range(0x20, 0x7F))
PUNCT = "·…‘’“”–—"
JAMO = "".join(chr(c) for c in range(0x3131, 0x318F))
LATIN = ASCII + "".join(chr(c) for c in range(0xA0, 0x100)) + "".join(chr(c) for c in range(0x2010, 0x205F))


def ks_x_1001_hangul():
    """The 2,350 common Hangul syllables of KS X 1001 (EUC-KR rows 0xB0–0xC8)."""
    out = set()
    for hi in range(0xB0, 0xC9):
        for lo in range(0xA1, 0xFF):
            try:
                ch = bytes([hi, lo]).decode("euc-kr")
            except UnicodeDecodeError:
                continue
            if 0xAC00 <= ord(ch) <= 0xD7A3:
                out.add(ch)
    return out


def hangul_used_in_src():
    used = set()
    for path in glob.glob(os.path.join(ROOT, "src", "**", "*.*"), recursive=True):
        if path.endswith((".jsx", ".js", ".css", ".json")):
            with io.open(path, encoding="utf-8", errors="ignore") as fh:
                used |= {c for c in fh.read() if 0xAC00 <= ord(c) <= 0xD7A3}
    return used


def download(url, dest):
    try:
        urllib.request.urlretrieve(url, dest)
    except OSError as err:
        sys.exit(f"download failed: {url} ({err})")


def make_subset(src, dst, text):
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    font = TTFont(src)
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    font.flavor = "woff2"
    font.save(dst)
    print(f"{os.path.basename(dst)}: {os.path.getsize(src) // 1024}KB -> {os.path.getsize(dst) // 1024}KB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--a2z", default=os.path.join(ROOT, "에이투지체-5Medium.woff2"), help="에이투지체 Medium source file")
    args = ap.parse_args()
    if not os.path.isfile(args.a2z):
        sys.exit(f"에이투지체 source not found: {args.a2z} (pass --a2z PATH)")

    os.makedirs(OUT, exist_ok=True)
    ks, used = ks_x_1001_hangul(), hangul_used_in_src()
    extra = used - ks
    print(f"Hangul: {len(ks)} KS X 1001 + {len(extra)} extra used in src" + (f" ({''.join(sorted(extra))})" if extra else ""))

    with tempfile.TemporaryDirectory() as tmp:
        light = os.path.join(tmp, "GongGothicLight.woff")
        medium = os.path.join(tmp, "GongGothicMedium.woff")
        download(ESAMANRU.format("Light"), light)
        download(ESAMANRU.format("Medium"), medium)
        make_subset(light, os.path.join(OUT, "esamanru-Light.subset.woff2"), "".join(sorted(ks | used)) + ASCII + PUNCT + JAMO)
        make_subset(medium, os.path.join(OUT, "esamanru-Medium.digits.woff2"), DIGITS + UNITS + " ")
        print("unit unicode-range for page.css:", ",".join(f"U+{ord(c):04X}" for c in UNITS))
    make_subset(args.a2z, os.path.join(OUT, "A2Z-Medium.latin.woff2"), LATIN)


if __name__ == "__main__":
    main()
