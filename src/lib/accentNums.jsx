// Inside accent headlines, a number and the Hangul syllable stuck right after it (1위, 10년, 9억+)
// are drawn as one unit in the number face (.bf-accent-num → esamanru Medium), while the rest of the
// Hangul stays esamanru Light. CSS unicode-range can't see neighbouring characters, so we split here.
// Covered syllables must also be in UNITS in scripts/subset-fonts.py (others fall back to Light).
const NUM_UNIT = /(\d[\d,.]*(?:[가-힣][+%]?|[+%])?)/g;

export function accentNums(text) {
  if (typeof text !== "string" || !/\d/.test(text)) return text;
  return text.split(NUM_UNIT).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="bf-accent-num">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
