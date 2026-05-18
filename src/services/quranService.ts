import { QuranResponse, SurahDetailResponse } from "../types";

async function fetchWithRetry(url: string, retries: number = 3, timeout: number = 10000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (response.ok) return response;
      if (response.status === 429) { // Rate limit
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
        continue;
      }
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

export async function fetchSurahs(): Promise<QuranResponse | null> {
  try {
    const response = await fetchWithRetry("https://api.alquran.cloud/v1/surah");
    return await response.json();
  } catch (error) {
    console.error("Error fetching surahs:", error);
    return null;
  }
}

export async function fetchSurahDetail(number: number, edition: string = "quran-uthmani"): Promise<SurahDetailResponse | null> {
  try {
    const response = await fetchWithRetry(`https://api.alquran.cloud/v1/surah/${number}/${edition}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching surah detail:", error);
    return null;
  }
}

export async function fetchSurahTranslation(number: number, edition: string = "bn.bengali"): Promise<SurahDetailResponse | null> {
  try {
    const response = await fetchWithRetry(`https://api.alquran.cloud/v1/surah/${number}/${edition}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching surah translation:", error);
    return null;
  }
}

export async function fetchSurahAudio(number: number, edition: string = "ar.alafasy"): Promise<SurahDetailResponse | null> {
  try {
    const response = await fetchWithRetry(`https://api.alquran.cloud/v1/surah/${number}/${edition}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching surah audio:", error);
    return null;
  }
}

export async function fetchParaDetail(number: number, edition: string = "quran-uthmani"): Promise<any | null> {
  try {
    const response = await fetchWithRetry(`https://api.alquran.cloud/v1/juz/${number}/${edition}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching para detail:", error);
    return null;
  }
}

export async function fetchParaTranslation(number: number, edition: string = "bn.bengali"): Promise<any | null> {
  try {
    const response = await fetchWithRetry(`https://api.alquran.cloud/v1/juz/${number}/${edition}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching para translation:", error);
    return null;
  }
}
