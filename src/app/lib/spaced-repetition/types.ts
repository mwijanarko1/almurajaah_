export type ReviewQuality = 1 | 2 | 3 | 4

export interface SpacedRepetitionState {
  lastRevised: string | null
  strength: 'Weak' | 'Medium' | 'Strong'
  revisionCycle: number
} 