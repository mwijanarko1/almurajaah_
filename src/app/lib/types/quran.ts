export interface SurahPageInfo {
  number: number
  name: string
  pages: number
}

export interface PageRevisionStats {
  pagesRevisedToday: number
  totalPagesRevised: number
  totalPages: number
  lastRevisedPages: number[]
  lastResetDate?: string
}

export interface StreakStats {
  currentStreak: number
  lastLoginDate: string
  bestStreak: number
} 