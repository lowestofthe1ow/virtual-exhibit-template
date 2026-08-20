// Fisher-Yates shuffle
export function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
}

// Normalize user answers for text input
export function normalizeAnswer(answer) {
  return answer
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

// Find an event by its ID
export function getEventById(timeline, id) {
  return timeline.find((event) => event.id === id);
}

// Sort events by year
export function sortByYear(events) {
  return [...events].sort((a, b) => a.year - b.year);
}

// Calculate percentage score
export function calculatePercentage(score, total) {
  return Math.round((score / total) * 100);
}

// Determine player's rank
export function getRank(score, total) {
  const percent = calculatePercentage(score, total);

  if (percent === 100) {
    return "🏆 Tech Pioneer";
  }

  if (percent >= 80) {
    return "🥇 Digital Innovator";
  }

  if (percent >= 60) {
    return "🥈 Computer Explorer";
  }

  if (percent >= 40) {
    return "🥉 Curious Learner";
  }

  return "📖 History Apprentice";
}