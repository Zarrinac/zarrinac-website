// Maps each product feature card to the content section it best describes, so
// clicking a card can smooth-scroll to that section.
//
// Cards and sections are NOT linked by an explicit key — a card titled e.g.
// "Noise Reduction" is described by a section whose body mentions it, even when
// the section heading is something evocative like "Spotless visuals await".
// We therefore match the card's title words against each section's title+text
// using idf-weighted token overlap: distinctive feature words (e.g. "share",
// "dolby") dominate, ubiquitous words contribute ~nothing. Title hits weigh
// more than body hits; the card description breaks ties.
//
// When no section scores above a confidence floor, we fall back to a positional
// 1:1 mapping only if the counts are equal (each card obviously owns one
// section); otherwise the card is left unlinked (null).

export type LinkableSection = { title: string; text: string };

// Short connective words (EN + common Persian particles) that carry no matching
// signal. Length < 3 tokens are dropped separately, which already covers most
// Persian stop particles (با، از، به، در، را، تا، که، و …).
const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'your',
  'you',
  'our',
  'that',
  'this',
  'from',
  'into',
  'more',
  'are',
  'was',
  'its',
  'has',
  'have',
  'can',
  'will',
  'all',
  'any',
  'out',
  'off',
  'per',
  'via',
  'every',
  'each',
  'when',
  'what',
  'how',
  'why',
  'who',
  'where',
  'than',
  'then',
  'them',
  'they',
  'their',
  'there',
  'over',
  'under',
  'about',
  'also',
  'just',
  'like',
  'make',
  'made',
  'one',
  'two',
  'use',
  'using',
  'used',
  'get',
  'gets',
  'let',
  'lets',
  'now',
  'new',
  'see',
  'feel',
  'enjoy',
  'tv',
  'hisense',
  'این',
  'است',
  'های',
  'شما',
]);

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ]+/g, ' ')
    .split(' ')
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

// Score floor below which a content match is considered too weak to trust.
const MIN_SCORE = 0.9;

export function buildFeatureCardSectionLinks(
  cards: { title: string; description?: string }[],
  sections: LinkableSection[],
  idPrefix = 'feature-section',
): (string | null)[] {
  if (sections.length === 0) return cards.map(() => null);

  const sectionTokens = sections.map((s) => {
    const titleTokens = new Set(tokenize(s.title));
    const allTokens = new Set([...titleTokens, ...tokenize(s.text)]);
    return { titleTokens, allTokens };
  });

  // Document frequency (how many sections contain each token) → idf weighting.
  const df = new Map<string, number>();
  for (const { allTokens } of sectionTokens) {
    for (const token of allTokens) df.set(token, (df.get(token) ?? 0) + 1);
  }
  const total = sections.length;
  const idf = (token: string) => Math.log(1 + total / (df.get(token) ?? total));

  const equalCounts = cards.length === sections.length;

  return cards.map((card, cardIdx) => {
    const titleTokens = [...new Set(tokenize(card.title))];
    const descTokens = new Set(tokenize(card.description ?? ''));

    let bestScore = 0;
    let bestSection = -1;
    sectionTokens.forEach(({ titleTokens: sTitle, allTokens: sAll }, sIdx) => {
      let score = 0;
      for (const token of titleTokens) {
        if (sTitle.has(token)) score += 2 * idf(token);
        else if (sAll.has(token)) score += idf(token);
      }
      for (const token of descTokens) {
        if (sAll.has(token)) score += 0.25 * idf(token);
      }
      if (score > bestScore) {
        bestScore = score;
        bestSection = sIdx;
      }
    });

    if (bestSection >= 0 && bestScore >= MIN_SCORE) return `${idPrefix}-${bestSection}`;
    if (equalCounts) return `${idPrefix}-${cardIdx}`;
    return null;
  });
}
