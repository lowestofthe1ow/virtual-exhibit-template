export function buildGallery(exhibits, rankings = [], { topCount = 15 } = {}) {
  const live = exhibits.filter((e) => e.status === 'live');

  const inOrder = [...live].sort(
    (a, b) => a.section.localeCompare(b.section) || a.group - b.group,
  );

  const rank = new Map(rankings.map((slug, i) => [slug, i]));
  const ranked = inOrder
    .filter((e) => rank.has(e.slug))
    .sort((a, b) => rank.get(a.slug) - rank.get(b.slug));

  const top = (ranked.length > 0 ? ranked : inOrder).slice(0, topCount);
  const topSlugs = new Set(top.map((e) => e.slug));

  const sections = [];
  for (const e of inOrder) {
    if (topSlugs.has(e.slug)) continue;
    let group = sections.find((s) => s.section === e.section);
    if (!group) sections.push((group = { section: e.section, exhibits: [] }));
    group.exhibits.push(e);
  }

  return { top, sections };
}
