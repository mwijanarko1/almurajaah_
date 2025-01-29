import { ReviewQuality, SurahCard } from './types';

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;
const EASE_BONUS = 0.15;
const MINIMUM_INTERVAL = 1; // 1 day

export function calculateNextReview(card: SurahCard, quality: ReviewQuality): SurahCard {
  let { interval, easeFactor } = card;
  const now = Date.now();

  // Calculate new interval based on quality
  if (quality < 3) {
    // If quality is less than 3 (failure), reset interval to 1
    interval = MINIMUM_INTERVAL;
  } else {
    if (!card.lastReviewed) {
      // First review
      interval = MINIMUM_INTERVAL;
    } else {
      // Calculate new interval
      interval = Math.ceil(interval * easeFactor);
    }
  }

  // Update ease factor based on performance
  easeFactor = Math.max(
    MIN_EASE_FACTOR,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Add bonus for perfect performance
  if (quality === 5) {
    easeFactor += EASE_BONUS;
  }

  const reviewHistory = [
    ...card.reviewHistory,
    {
      timestamp: now,
      quality,
      interval,
      easeFactor
    }
  ];

  return {
    ...card,
    lastReviewed: now,
    nextReview: now + interval * 24 * 60 * 60 * 1000, // Convert days to milliseconds
    interval,
    easeFactor,
    reviewHistory
  };
}

export function initializeCard(surahNumber: number): SurahCard {
  return {
    surahNumber,
    lastReviewed: null,
    nextReview: null,
    interval: MINIMUM_INTERVAL,
    easeFactor: DEFAULT_EASE_FACTOR,
    reviewHistory: []
  };
}

export function getDueCards(cards: { [surahNumber: string]: SurahCard }): number[] {
  const now = Date.now();
  return Object.values(cards)
    .filter(card => !card.nextReview || card.nextReview <= now)
    .map(card => card.surahNumber)
    .sort((a, b) => a - b);
} 