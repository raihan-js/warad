// services/quranService.ts
const BASE_URL = 'https://api.quran.com/api/v4';

export interface Surah {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface Ayah {
  id: number;
  text: string;
  translation: string;
  audio_url: string;
  number: number;
  surah_id: number;
}

export const fetchSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${BASE_URL}/chapters?language=en`);
    const data = await response.json();
    return data.chapters;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
};

// services/quranService.ts (updated audio URL)
export const fetchSurahDetails = async (surahId: number): Promise<Ayah[]> => {
  try {
    // Fetch ayahs
    const ayahsResponse = await fetch(
      `${BASE_URL}/quran/verses/uthmani?chapter_number=${surahId}`
    );
    const ayahsData = await ayahsResponse.json();
    
    // Fetch translations
    const translationsResponse = await fetch(
      `${BASE_URL}/quran/translations/131?chapter_number=${surahId}`
    );
    const translationsData = await translationsResponse.json();
    
    // Combine data
    return ayahsData.verses.map((verse: any, index: number) => {
      const verseKey = verse.verse_key;
      const [chapter, verseNumber] = verseKey.split(':');
      
      // Use a more reliable audio URL format
      // Format: https://audio.qurancdn.com/Alafasy/mp3/001001.mp3
      // Where 001 is the surah number (padded to 3 digits) and 001 is the verse number (padded to 3 digits)
      const paddedSurah = chapter.padStart(3, '0');
      const paddedVerse = verseNumber.padStart(3, '0');
      const audioUrl = `https://audio.qurancdn.com/Alafasy/mp3/${paddedSurah}${paddedVerse}.mp3`;
      
      return {
        id: verse.id,
        text: verse.text_uthmani,
        translation: translationsData.translations[index]?.text || '',
        audio_url: audioUrl,
        number: verse.verse_number,
        surah_id: surahId,
      };
    });
  } catch (error) {
    console.error(`Error fetching surah ${surahId} details:`, error);
    throw error;
  }
};