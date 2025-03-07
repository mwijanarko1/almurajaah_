export interface Surah {
  number: number
  name: string
  translatedName: string
  verses?: string // Optional verse range for partial surahs
}

export interface JuzData {
  number: number
  surahs: Surah[]
}

export const juzData: JuzData[] = [
  {
    number: 1,
    surahs: [
      { number: 1, name: "al-Fātihah", translatedName: "THE OPENING" },
      { number: 2, name: "al-Baqarah", translatedName: "THE COW", verses: "1-141" }
    ]
  },
  {
    number: 2,
    surahs: [
      { number: 2, name: "al-Baqarah", translatedName: "THE COW", verses: "142-252" }
    ]
  },
  {
    number: 3,
    surahs: [
      { number: 2, name: "al-Baqarah", translatedName: "THE COW", verses: "253-286" },
      { number: 3, name: "Āl-i-'Imrān", translatedName: "THE FAMILY OF 'IMRĀN" }
    ]
  },
  {
    number: 4,
    surahs: [
      { number: 4, name: "an-Nisā'", translatedName: "THE WOMEN", verses: "1-176" }
    ]
  },
  {
    number: 5,
    surahs: [
      { number: 4, name: "an-Nisā'", translatedName: "THE WOMEN", verses: "177-END" }
    ]
  },
  {
    number: 6,
    surahs: [
      { number: 5, name: "al-Mā'idah", translatedName: "THE TABLE SPREAD" }
    ]
  },
  {
    number: 7,
    surahs: [
      { number: 6, name: "al-An'ām", translatedName: "THE CATTLE" }
    ]
  },
  {
    number: 8,
    surahs: [
      { number: 7, name: "al-A'rāf", translatedName: "THE HEIGHTS" }
    ]
  },
  {
    number: 9,
    surahs: [
      { number: 8, name: "al-Anfāl", translatedName: "SPOILS OF WAR" }
    ]
  },
  {
    number: 10,
    surahs: [
      { number: 9, name: "at-Tawbah", translatedName: "REPENTANCE" }
    ]
  },
  {
    number: 11,
    surahs: [
      { number: 10, name: "Yūnus", translatedName: "JONAH" },
      { number: 11, name: "Hūd", translatedName: "HUD" }
    ]
  },
  {
    number: 12,
    surahs: [
      { number: 12, name: "Yūsuf", translatedName: "JOSEPH" }
    ]
  },
  {
    number: 13,
    surahs: [
      { number: 13, name: "ar-Ra'd", translatedName: "THUNDER" },
      { number: 14, name: "Ibrāhīm", translatedName: "ABRAHAM" }
    ]
  },
  {
    number: 14,
    surahs: [
      { number: 15, name: "al-Hijr", translatedName: "THE ROCKY TRACT" },
      { number: 16, name: "an-Nahl", translatedName: "THE BEE" }
    ]
  },
  {
    number: 15,
    surahs: [
      { number: 17, name: "al-Isrā'", translatedName: "THE NIGHT JOURNEY" },
      { number: 18, name: "al-Kahf", translatedName: "THE CAVE" }
    ]
  },
  {
    number: 16,
    surahs: [
      { number: 19, name: "Maryam", translatedName: "MARY" },
      { number: 20, name: "Tāhā", translatedName: "TA-HA" }
    ]
  },
  {
    number: 17,
    surahs: [
      { number: 21, name: "al-Ambiyā'", translatedName: "THE PROPHETS" },
      { number: 22, name: "al-Hajj", translatedName: "THE PILGRIMAGE" }
    ]
  },
  {
    number: 18,
    surahs: [
      { number: 23, name: "al-Mu'minūn", translatedName: "THE BELIEVERS" },
      { number: 24, name: "an-Nūr", translatedName: "THE LIGHT" },
      { number: 25, name: "al-Furqān", translatedName: "THE CRITERION" }
    ]
  },
  {
    number: 19,
    surahs: [
      { number: 26, name: "ash-Shu'arā'", translatedName: "THE POETS" },
      { number: 27, name: "an-Naml", translatedName: "THE ANT" }
    ]
  },
  {
    number: 20,
    surahs: [
      { number: 28, name: "al-Qasas", translatedName: "THE STORIES" },
      { number: 29, name: "al-'Ankabūt", translatedName: "THE SPIDER" }
    ]
  },
  {
    number: 21,
    surahs: [
      { number: 30, name: "ar-Rūm", translatedName: "THE ROMAN" },
      { number: 31, name: "Luqmān", translatedName: "LUQMAN" },
      { number: 32, name: "as-Sajdah", translatedName: "THE PROSTRATION" },
      { number: 33, name: "al-Ahzāb", translatedName: "THE CONFEDERATES" }
    ]
  },
  {
    number: 22,
    surahs: [
      { number: 34, name: "Saba'", translatedName: "SHEBA" },
      { number: 35, name: "Fātir", translatedName: "ORIGINATOR" },
      { number: 36, name: "Yāsīn", translatedName: "YA-SIN" }
    ]
  },
  {
    number: 23,
    surahs: [
      { number: 37, name: "as-Sāffāt", translatedName: "THOSE WHO SET THE RANKS" },
      { number: 38, name: "Sād", translatedName: "SAD" }
    ]
  },
  {
    number: 24,
    surahs: [
      { number: 39, name: "az-Zumar", translatedName: "THE TROOPS" },
      { number: 40, name: "Ghāfir", translatedName: "THE FORGIVER" }
    ]
  },
  {
    number: 25,
    surahs: [
      { number: 41, name: "Fussilat", translatedName: "EXPLAINED IN DETAIL" },
      { number: 42, name: "ash-Shūrā", translatedName: "THE CONSULTATION" },
      { number: 43, name: "az-Zukhruf", translatedName: "THE ORNAMENTS OF GOLD" },
      { number: 44, name: "ad-Dukhān", translatedName: "THE SMOKE" },
      { number: 45, name: "al-Jāthiyah", translatedName: "THE KNEELING" }
    ]
  },
  {
    number: 26,
    surahs: [
      { number: 46, name: "al-Ahqāf", translatedName: "THE SAND-DUNES" },
      { number: 47, name: "Muhammad", translatedName: "MUHAMMAD" },
      { number: 48, name: "al-Fath", translatedName: "THE VICTORY" },
      { number: 49, name: "al-Hujurāt", translatedName: "THE ROOMS" },
      { number: 50, name: "Qāf", translatedName: "QAF" }
    ]
  },
  {
    number: 27,
    surahs: [
      { number: 51, name: "adh-Dhāriyāt", translatedName: "THE SCATTERING WINDS" },
      { number: 52, name: "at-Tūr", translatedName: "THE MOUNT" },
      { number: 53, name: "an-Najm", translatedName: "THE STAR" },
      { number: 54, name: "al-Qamar", translatedName: "THE MOON" },
      { number: 55, name: "ar-Rahmān", translatedName: "THE MOST MERCIFUL" },
      { number: 56, name: "al-Wāqi'ah", translatedName: "THE INEVITABLE" },
      { number: 57, name: "al-Hadīd", translatedName: "THE IRON" }
    ]
  },
  {
    number: 28,
    surahs: [
      { number: 58, name: "al-Mujādalah", translatedName: "THE PLEADING WOMAN" },
      { number: 59, name: "al-Hashr", translatedName: "THE EXILE" },
      { number: 60, name: "al-Mumtahinah", translatedName: "THE WOMAN TO BE EXAMINED" },
      { number: 61, name: "as-Saff", translatedName: "THE RANKS" },
      { number: 62, name: "al-Jumu'ah", translatedName: "THE CONGREGATION, FRIDAY" },
      { number: 63, name: "al-Munāfiqūn", translatedName: "THE HYPOCRITES" },
      { number: 64, name: "at-Taghābun", translatedName: "THE MUTUAL DISILLUSION" },
      { number: 65, name: "at-Talāq", translatedName: "THE DIVORCE" },
      { number: 66, name: "at-Tahrīm", translatedName: "THE PROHIBITION" }
    ]
  },
  {
    number: 29,
    surahs: [
      { number: 67, name: "al-Mulk", translatedName: "THE SOVEREIGNTY" },
      { number: 68, name: "al-Qalam", translatedName: "THE PEN" },
      { number: 69, name: "al-Hāqqah", translatedName: "THE REALITY" },
      { number: 70, name: "al-Ma'ārij", translatedName: "THE ASCENDING STAIRWAYS" },
      { number: 71, name: "Nūh", translatedName: "NOAH" },
      { number: 72, name: "al-Jinn", translatedName: "THE JINN" },
      { number: 73, name: "al-Muzzammil", translatedName: "THE ENSHROUDED ONE" },
      { number: 74, name: "al-Muddaththir", translatedName: "THE CLOAKED ONE" },
      { number: 75, name: "al-Qiyāmah", translatedName: "THE RESURRECTION" },
      { number: 76, name: "al-Insān", translatedName: "THE MAN" },
      { number: 77, name: "al-Mursalāt", translatedName: "THE EMISSARIES" }
    ]
  },
  {
    number: 30,
    surahs: [
      { number: 78, name: "an-Naba'", translatedName: "THE TIDINGS" },
      { number: 79, name: "an-Nāzi'āt", translatedName: "THOSE WHO DRAG FORTH" },
      { number: 80, name: "'Abasa", translatedName: "HE FROWNED" },
      { number: 81, name: "at-Takwīr", translatedName: "THE OVERTHROWING" },
      { number: 82, name: "al-Infitār", translatedName: "THE CLEAVING" },
      { number: 83, name: "al-Mutaffifīn", translatedName: "THE DEFRAUDING" },
      { number: 84, name: "al-Inshiqāq", translatedName: "THE SUNDERING" },
      { number: 85, name: "al-Burūj", translatedName: "THE MANSIONS OF STARS" },
      { number: 86, name: "at-Tāriq", translatedName: "THE NIGHT COMER" },
      { number: 87, name: "al-A'lā", translatedName: "THE MOST HIGH" },
      { number: 88, name: "al-Ghāshiyah", translatedName: "THE OVERWHELMING" },
      { number: 89, name: "al-Fajr", translatedName: "THE DAWN" },
      { number: 90, name: "al-Balad", translatedName: "THE CITY" },
      { number: 91, name: "ash-Shams", translatedName: "THE SUN" },
      { number: 92, name: "al-Layl", translatedName: "THE NIGHT" },
      { number: 93, name: "ad-Duhā", translatedName: "THE MORNING HOURS" },
      { number: 94, name: "ash-Sharh", translatedName: "THE RELIEF" },
      { number: 95, name: "at-Tīn", translatedName: "THE FIG" },
      { number: 96, name: "al-'Alaq", translatedName: "THE CLOT" },
      { number: 97, name: "al-Qadr", translatedName: "THE POWER" },
      { number: 98, name: "al-Bayyinah", translatedName: "THE CLEAR PROOF" },
      { number: 99, name: "az-Zalzalah", translatedName: "THE EARTHQUAKE" },
      { number: 100, name: "al-'Ādiyāt", translatedName: "THE COURSER" },
      { number: 101, name: "al-Qāri'ah", translatedName: "THE CALAMITY" },
      { number: 102, name: "at-Takāthur", translatedName: "THE RIVALRY IN WORLD INCREASE" },
      { number: 103, name: "al-'Asr", translatedName: "THE DECLINING DAY" },
      { number: 104, name: "al-Humazah", translatedName: "THE TRADUCER" },
      { number: 105, name: "al-Fīl", translatedName: "THE ELEPHANT" },
      { number: 106, name: "al-Quraysh", translatedName: "QURAISH" },
      { number: 107, name: "al-Mā'ūn", translatedName: "THE SMALL KINDNESS" },
      { number: 108, name: "al-Kawthar", translatedName: "THE ABUNDANCE" },
      { number: 109, name: "al-Kāfirūn", translatedName: "THE DISBELIEVERS" },
      { number: 110, name: "an-Nasr", translatedName: "THE DIVINE SUPPORT" },
      { number: 111, name: "al-masad", translatedName: "THE PALM FIBER" },
      { number: 112, name: "al-Ikhlās", translatedName: "THE SINCERITY" },
      { number: 113, name: "al-Falaq", translatedName: "THE DAYBREAK" },
      { number: 114, name: "al-Nās", translatedName: "MANKIND" }
    ]
  }
] 