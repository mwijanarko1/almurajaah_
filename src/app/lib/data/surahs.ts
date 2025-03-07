export interface Surah {
  number: number
  name: string
  juz: number[]
}

export const surahs: Surah[] = [
  { number: 1, name: "Al-Fatihah", juz: [1] },
  { number: 2, name: "Al-Baqarah", juz: [1, 2, 3] },
  { number: 3, name: "Ali 'Imran", juz: [3, 4] },
  { number: 4, name: "An-Nisa", juz: [4, 5, 6] },
  { number: 5, name: "Al-Ma'idah", juz: [6, 7] },
  { number: 6, name: "Al-An'am", juz: [7, 8] },
  { number: 7, name: "Al-A'raf", juz: [8, 9] },
  { number: 8, name: "Al-Anfal", juz: [9, 10] },
  { number: 9, name: "At-Tawbah", juz: [10, 11] },
  { number: 10, name: "Yunus", juz: [11] },
  { number: 11, name: "Hud", juz: [11, 12] },
  { number: 12, name: "Yusuf", juz: [12, 13] },
  { number: 13, name: "Ar-Ra'd", juz: [13] },
  { number: 14, name: "Ibrahim", juz: [13] },
  { number: 15, name: "Al-Hijr", juz: [14] },
  { number: 16, name: "An-Nahl", juz: [14] },
  { number: 17, name: "Al-Isra", juz: [15] },
  { number: 18, name: "Al-Kahf", juz: [15, 16] },
  { number: 19, name: "Maryam", juz: [16] },
  { number: 20, name: "Ta-Ha", juz: [16] },
  { number: 21, name: "Al-Anbya", juz: [17] },
  { number: 22, name: "Al-Hajj", juz: [17] },
  { number: 23, name: "Al-Mu'minun", juz: [18] },
  { number: 24, name: "An-Nur", juz: [18] },
  { number: 25, name: "Al-Furqan", juz: [19] },
  { number: 26, name: "Ash-Shu'ara", juz: [19] },
  { number: 27, name: "An-Naml", juz: [19, 20] },
  { number: 28, name: "Al-Qasas", juz: [20] },
  { number: 29, name: "Al-'Ankabut", juz: [20, 21] },
  { number: 30, name: "Ar-Rum", juz: [21] },
  { number: 31, name: "Luqman", juz: [21] },
  { number: 32, name: "As-Sajdah", juz: [21] },
  { number: 33, name: "Al-Ahzab", juz: [21, 22] },
  { number: 34, name: "Saba", juz: [22] },
  { number: 35, name: "Fatir", juz: [22] },
  { number: 36, name: "Ya-Sin", juz: [22, 23] },
  { number: 37, name: "As-Saffat", juz: [23] },
  { number: 38, name: "Sad", juz: [23] },
  { number: 39, name: "Az-Zumar", juz: [23, 24] },
  { number: 40, name: "Ghafir", juz: [24] },
  { number: 41, name: "Fussilat", juz: [24, 25] },
  { number: 42, name: "Ash-Shura", juz: [25] },
  { number: 43, name: "Az-Zukhruf", juz: [25] },
  { number: 44, name: "Ad-Dukhan", juz: [25] },
  { number: 45, name: "Al-Jathiyah", juz: [25] },
  { number: 46, name: "Al-Ahqaf", juz: [26] },
  { number: 47, name: "Muhammad", juz: [26] },
  { number: 48, name: "Al-Fath", juz: [26] },
  { number: 49, name: "Al-Hujurat", juz: [26] },
  { number: 50, name: "Qaf", juz: [26] },
  { number: 51, name: "Adh-Dhariyat", juz: [26, 27] },
  { number: 52, name: "At-Tur", juz: [27] },
  { number: 53, name: "An-Najm", juz: [27] },
  { number: 54, name: "Al-Qamar", juz: [27] },
  { number: 55, name: "Ar-Rahman", juz: [27] },
  { number: 56, name: "Al-Waqi'ah", juz: [27] },
  { number: 57, name: "Al-Hadid", juz: [27] },
  { number: 58, name: "Al-Mujadilah", juz: [28] },
  { number: 59, name: "Al-Hashr", juz: [28] },
  { number: 60, name: "Al-Mumtahanah", juz: [28] },
  { number: 61, name: "As-Saff", juz: [28] },
  { number: 62, name: "Al-Jumu'ah", juz: [28] },
  { number: 63, name: "Al-Munafiqun", juz: [28] },
  { number: 64, name: "At-Taghabun", juz: [28] },
  { number: 65, name: "At-Talaq", juz: [28] },
  { number: 66, name: "At-Tahrim", juz: [28] },
  { number: 67, name: "Al-Mulk", juz: [29] },
  { number: 68, name: "Al-Qalam", juz: [29] },
  { number: 69, name: "Al-Haqqah", juz: [29] },
  { number: 70, name: "Al-Ma'arij", juz: [29] },
  { number: 71, name: "Nuh", juz: [29] },
  { number: 72, name: "Al-Jinn", juz: [29] },
  { number: 73, name: "Al-Muzzammil", juz: [29] },
  { number: 74, name: "Al-Muddaththir", juz: [29] },
  { number: 75, name: "Al-Qiyamah", juz: [29] },
  { number: 76, name: "Al-Insan", juz: [29] },
  { number: 77, name: "Al-Mursalat", juz: [29] },
  { number: 78, name: "An-Naba", juz: [30] },
  { number: 79, name: "An-Nazi'at", juz: [30] },
  { number: 80, name: "'Abasa", juz: [30] },
  { number: 81, name: "At-Takwir", juz: [30] },
  { number: 82, name: "Al-Infitar", juz: [30] },
  { number: 83, name: "Al-Mutaffifin", juz: [30] },
  { number: 84, name: "Al-Inshiqaq", juz: [30] },
  { number: 85, name: "Al-Buruj", juz: [30] },
  { number: 86, name: "At-Tariq", juz: [30] },
  { number: 87, name: "Al-A'la", juz: [30] },
  { number: 88, name: "Al-Ghashiyah", juz: [30] },
  { number: 89, name: "Al-Fajr", juz: [30] },
  { number: 90, name: "Al-Balad", juz: [30] },
  { number: 91, name: "Ash-Shams", juz: [30] },
  { number: 92, name: "Al-Layl", juz: [30] },
  { number: 93, name: "Ad-Duha", juz: [30] },
  { number: 94, name: "Ash-Sharh", juz: [30] },
  { number: 95, name: "At-Tin", juz: [30] },
  { number: 96, name: "Al-'Alaq", juz: [30] },
  { number: 97, name: "Al-Qadr", juz: [30] },
  { number: 98, name: "Al-Bayyinah", juz: [30] },
  { number: 99, name: "Az-Zalzalah", juz: [30] },
  { number: 100, name: "Al-'Adiyat", juz: [30] },
  { number: 101, name: "Al-Qari'ah", juz: [30] },
  { number: 102, name: "At-Takathur", juz: [30] },
  { number: 103, name: "Al-'Asr", juz: [30] },
  { number: 104, name: "Al-Humazah", juz: [30] },
  { number: 105, name: "Al-Fil", juz: [30] },
  { number: 106, name: "Quraysh", juz: [30] },
  { number: 107, name: "Al-Ma'un", juz: [30] },
  { number: 108, name: "Al-Kawthar", juz: [30] },
  { number: 109, name: "Al-Kafirun", juz: [30] },
  { number: 110, name: "An-Nasr", juz: [30] },
  { number: 111, name: "Al-Masad", juz: [30] },
  { number: 112, name: "Al-Ikhlas", juz: [30] },
  { number: 113, name: "Al-Falaq", juz: [30] },
  { number: 114, name: "An-Nas", juz: [30] }
] 