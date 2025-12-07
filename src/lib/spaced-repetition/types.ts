export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface CardReviewHistory {
  timestamp: number;
  quality: ReviewQuality;
  interval: number;
  easeFactor: number;
}

export interface SurahCard {
  surahNumber: number;
  lastReviewed: number | null;
  nextReview: number | null;
  interval: number;
  easeFactor: number;
  reviewHistory: CardReviewHistory[];
}

export interface SpacedRepetitionState {
  cards: { [surahNumber: string]: SurahCard };
  lastSync: number;
} 