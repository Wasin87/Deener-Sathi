import { PrayerData } from "../types";

export async function fetchPrayerTimes(lat: number, lon: number): Promise<PrayerData | null> {
  try {
    const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`);
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
}

export async function fetchPrayerTimesByCity(city: string, country: string = "Bangladesh"): Promise<PrayerData | null> {
  try {
    const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching prayer times by city:", error);
    return null;
  }
}
