import { QuranResponse, SurahDetailResponse } from "../types";

export async function fetchSurahs(): Promise<QuranResponse | null> {
  try {
    const response = await fetch("https://api.alquran.cloud/v1/surah");
    return await response.json();
  } catch (error) {
    console.error("Error fetching surahs:", error);
    return null;
  }
}

export async function fetchSurahDetail(number: number, edition: string = "quran-uthmani"): Promise<SurahDetailResponse | null> {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/${edition}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching surah detail:", error);
    return null;
  }
}

export async function fetchSurahTranslation(number: number, edition: string = "bn.bengali"): Promise<SurahDetailResponse | null> {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/${edition}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching surah translation:", error);
    return null;
  }
}

export async function fetchSurahAudio(number: number, edition: string = "ar.alafasy"): Promise<SurahDetailResponse | null> {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/${edition}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching surah audio:", error);
    return null;
  }
}

export async function fetchParaDetail(number: number, edition: string = "quran-uthmani"): Promise<any | null> {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/juz/${number}/${edition}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching para detail:", error);
    return null;
  }
}

export async function fetchParaTranslation(number: number, edition: string = "bn.bengali"): Promise<any | null> {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/juz/${number}/${edition}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching para translation:", error);
    return null;
  }
}
