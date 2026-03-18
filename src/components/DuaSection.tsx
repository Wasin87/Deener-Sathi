import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Sun, Moon, Coffee, Plane, Copy, Check, ChevronRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface Dua {
  id: number;
  category: string;
  title: string;
  arabic: string;
  bangla: string;
  meaning: string;
  source?: string;
  audio_url?: string;
}

export const DuaSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const duas: Dua[] = React.useMemo(() => [
    {
      id: 1,
      category: "Morning",
      title: t('duaWakingUp'),
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
      bangla: language === 'bn' ? "আলহামদুলিল্লাহিল্লাজি আহইয়ানা বা'দা মা আমাতানা ওয়া ইলাইহিন নুশুর।" : "Alhamdulillahilladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
      meaning: t('duaWakingUpMeaning'),
      source: language === 'bn' ? "(বুখারী ৬৩১৪)" : "(Bukhari 6314)"
    },
    {
      id: 2,
      category: "Night",
      title: t('duaSleeping'),
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      bangla: language === 'bn' ? "বিসমিকাল্লাহুম্মা আমুতু ওয়া আহইয়া।" : "Bismika Allahumma amutu wa ahya.",
      meaning: t('duaSleepingMeaning'),
      source: language === 'bn' ? "(বুখারী ৬৩১২)" : "(Bukhari 6312)"
    },
    {
      id: 3,
      category: "Daily",
      title: t('duaBeforeEating'),
      arabic: "بِسْمِ اللَّهِ",
      bangla: language === 'bn' ? "বিসমিল্লাহ।" : "Bismillah.",
      meaning: t('duaBeforeEatingMeaning'),
      source: language === 'bn' ? "(তিরমিজি ১৮৫৮)" : "(Tirmidhi 1858)"
    },
    {
      id: 4,
      category: "Travel",
      title: t('duaTravel'),
      arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
      bangla: language === 'bn' ? "সুবহানাল্লাজি সাখখারা লানা হাজা ওয়ামা কুন্না লাহু মুকরিনিন, ওয়া ইন্না ইলা রাব্বিনা লামুনকালিবুন।" : "Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinina wa inna ila rabbina lamunqalibun.",
      meaning: t('duaTravelMeaning'),
      source: language === 'bn' ? "(মুসলিম ১৩৪২)" : "(Muslim 1342)"
    },
    {
      id: 5,
      category: "Daily",
      title: t('duaAfterEating'),
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
      bangla: language === 'bn' ? "আলহামদুলিল্লাহিল্লাজি আতআমানা ওয়া সাকানা ওয়া জাআলানা মুসলিমিন।" : "Alhamdulillahilladhi at'amana wa saqana wa ja'alana muslimin.",
      meaning: t('duaAfterEatingMeaning'),
      source: language === 'bn' ? "(আবু দাউদ ৩৮৫০)" : "(Abu Dawud 3850)"
    },
    {
      id: 6,
      category: "Morning",
      title: t('duaAyatulKursi'),
      arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      bangla: language === 'bn' ? "আল্লাহু লা ইলাহা ইল্লা হুয়াল হাইয়্যুল কাইয়্যুম। লা তা'খুযুহু সিনাতু ওয়ালা নাউম। লাহু মা ফিস সামাওয়াতি ওয়ামা ফিল আরদ। মান যাল্লাযি ইয়াশফাউ ইনদাহু ইল্লা বিইযনিহ। ইয়া'লামু মা বাইনা আইদিহিম ওয়ামা খালফাহুম। ওয়ালা ইউহিতুনা বিশাইইম মিন ইলমিহি ইল্লা বিমা শা-আ। ওয়াসিআ কুরসিইয়ুহুস সামাওয়াতি ওয়াল আরদ। ওয়ালা ইয়াউদুহু হিফযুহুমা ওয়াহুয়াল আলিইয়ুল আযীম।" : "Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnih. Ya'lamu ma bayna aydihim wa ma khalfahum. Wa la yuhituna bi-shay'im-min 'ilmihi illa bi-ma sha'a. Wasi'a kursiyyuhus-samawati wal-ard. Wa la ya'uduhu hifdhuhuma wa Huwal-'Aliyyul-'Adheem.",
      meaning: t('duaAyatulKursiMeaning'),
      source: language === 'bn' ? "(সূরা আল-বাকারাহ ২৫৫)" : "(Surah Al-Baqarah 255)",
      audio_url: "https://everyayah.com/data/Alafasy_128kbps/002255.mp3"
    },
    {
      id: 7,
      category: "Daily",
      title: t('duaEnteringMosque'),
      arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
      bangla: language === 'bn' ? "আল্লাহুম্মাফতাহ লি আবওয়াবা রাহমাতিক।" : "Allahumma-ftah li abwaba rahmatik.",
      meaning: t('duaEnteringMosqueMeaning'),
      source: language === 'bn' ? "(মুসলিম ৭১৩)" : "(Muslim 713)"
    },
    {
      id: 8,
      category: "Daily",
      title: t('duaLeavingMosque'),
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
      bangla: language === 'bn' ? "আল্লাহুম্মা ইন্নি আসআলুকা মিন ফাদলিক।" : "Allahumma inni as'aluka min fadlik.",
      meaning: t('duaLeavingMosqueMeaning'),
      source: language === 'bn' ? "(মুসলিম ৭১৩)" : "(Muslim 713)"
    },
    {
      id: 9,
      category: "Daily",
      title: t('duaForParents'),
      arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
      bangla: language === 'bn' ? "রাব্বির হামহুমা কামা রাব্বায়ানি সাগিরা।" : "Rabbir-hamhuma kama rabbayani saghira.",
      meaning: t('duaForParentsMeaning'),
      source: language === 'bn' ? "(সূরা বনী ইসরাঈল ২৪)" : "(Surah Al-Isra 24)"
    },
    {
      id: 10,
      category: "Daily",
      title: t('duaAfterWudu'),
      arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
      bangla: language === 'bn' ? "আশহাদু আল্লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারিকা লাহু ওয়া আশহাদু আন্না মুহাম্মাদান আবদুহু ওয়া রাসূলুহু।" : "Ashhadu alla ilaha illallahu wahdahu la sharika lahu wa ashhadu anna Muhammadan 'abduhu wa Rasuluhu.",
      meaning: t('duaAfterWuduMeaning'),
      source: language === 'bn' ? "(মুসলিম ২৩৪)" : "(Muslim 234)"
    },
    {
      id: 11,
      category: "Daily",
      title: t('duaBeforeStudy'),
      arabic: "رَّبِّ زِدْنِي عِلْمًا",
      bangla: language === 'bn' ? "রাব্বি যিদনি ইলমা।" : "Rabbi zidni 'ilma.",
      meaning: t('duaBeforeStudyMeaning'),
      source: language === 'bn' ? "(সূরা ত্বাহা ১১৪)" : "(Surah Ta-Ha 114)"
    },
    {
      id: 12,
      category: "Morning",
      title: t('duaForForgiveness'),
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      bangla: language === 'bn' ? "আল্লাহুম্মা আনতা রাব্বি লা ইলাহা ইল্লা আনতা খালাকতানি ওয়া আনা আবদুকা ওয়া আনা আলা আহদিকা ওয়া ওয়াদিকা মাসতাতাতু। আউযুবিকা মিন শাররি মা সানাতু আবউ লাকা বিনি'মাতিকা আলাইয়া ওয়া আবউ লাকা বিযানবি ফাগফিরলি ফাইন্নাহু লা ইয়াগফিরুয যুনুবা ইল্লা আনতা।" : "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu. A'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi faghfir li fa-innahu la yaghfirudh-dhunuba illa Anta.",
      meaning: t('duaForForgivenessMeaning'),
      source: language === 'bn' ? "(বুখারী ৬৩০৬)" : "(Bukhari 6306)"
    },
    {
      id: 13,
      category: "Daily",
      title: t('duaProtectionShirk'),
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أُشْرِكَ بِكَ وَأَنَا أَعْلَمُ، وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ",
      bangla: language === 'bn' ? "আল্লাহুম্মা ইন্নি আউযুবিকা আন উশরিকা বিকা ওয়া আনা আ'লামু, ওয়া আসতাগফিরুকা লিমা লা আ'লামু।" : "Allahumma inni a'udhu bika an ushrika bika wa ana a'lamu, wa astaghfiruka lima la a'lamu.",
      meaning: t('duaProtectionShirkMeaning'),
      source: language === 'bn' ? "(আহমদ ৪/৪০৩)" : "(Ahmad 4/403)"
    },
    {
      id: 14,
      category: "Daily",
      title: t('duaRizq'),
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
      bangla: language === 'bn' ? "আল্লাহুম্মা ইন্নি আসআলুকা ইলমান নাফিয়াঁ, ওয়া রিযকান তয়্যিবাঁ, ওয়া আমালান মুতাক্বাব্বালা।" : "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.",
      meaning: t('duaRizqMeaning'),
      source: language === 'bn' ? "(ইবনে মাজাহ ৯২৫)" : "(Ibn Majah 925)"
    },
    {
      id: 15,
      category: "Daily",
      title: t('duaHealth'),
      arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ",
      bangla: language === 'bn' ? "আল্লাহুম্মা আফিনি ফি বাদানি, আল্লাহুম্মা আফিনি ফি সাময়ি, আল্লাহুম্মা আফিনি ফি বাসারি, লা ইলাহা ইল্লা আনতা।" : "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa Anta.",
      meaning: t('duaHealthMeaning'),
      source: language === 'bn' ? "(আবু দাউদ ৫০৯০)" : "(Abu Dawud 5090)"
    },
    {
      id: 16,
      category: "Daily",
      title: t('duaEase'),
      arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
      bangla: language === 'bn' ? "আল্লাহুম্মা লা সাহলা ইল্লা মা জাআলতাহু সাহলা, ওয়া আনতা তাজআলুল হাযনা ইযা শি'তা সাহলা।" : "Allahumma la sahla illa ma ja'altahu sahla, wa Anta taj'alul-hazna idha shi'ta sahla.",
      meaning: t('duaEaseMeaning'),
      source: language === 'bn' ? "(ইবনে হিব্বান ৯৭৪)" : "(Ibn Hibban 974)"
    },
    {
      id: 17,
      category: "Daily",
      title: t('duaProtectionEvil'),
      arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
      bangla: language === 'bn' ? "আউযু বিকালিমাতিলাহিত তাম্মাতি মিন শাররি মা খালাক্ব।" : "A'udhu bikalimatillahit-tammati min sharri ma khalaq.",
      meaning: t('duaProtectionEvilMeaning'),
      source: language === 'bn' ? "(মুসলিম ২৭০৮)" : "(Muslim 2708)"
    },
    {
      id: 18,
      category: "Daily",
      title: t('duaEnteringHome'),
      arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
      bangla: language === 'bn' ? "বিসমিল্লাহি ওয়ালাজনা, ওয়া বিসমিল্লাহি খারাজনা, ওয়া আলা রাব্বিনা তাওয়াক্কালনা।" : "Bismillahi walajna, wa Bismillahi kharajna, wa 'ala Rabbina tawakkalna.",
      meaning: t('duaEnteringHomeMeaning'),
      source: language === 'bn' ? "(আবু দাউদ ৫০৯৬)" : "(Abu Dawud 5096)"
    },
    {
      id: 19,
      category: "Daily",
      title: t('duaLeavingHome'),
      arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      bangla: language === 'bn' ? "বিসমিল্লাহি তাওয়াক্কালতু আলাল্লাহি, ওয়া লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ।" : "Bismillahi tawakkaltu 'alallahi, wa la hawla wa la quwwata illa billah.",
      meaning: t('duaLeavingHomeMeaning'),
      source: language === 'bn' ? "(আবু দাউদ ৫০৯৫)" : "(Abu Dawud 5095)"
    },
    {
      id: 20,
      category: "Daily",
      title: t('duaWearingClothes'),
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
      bangla: language === 'bn' ? "আলহামদুলিল্লাহিল্লাজি কাসানি হাজা ওয়া রাযাকানিহি মিন গাইরি হাওলিম মিন্নি ওয়া লা কুওয়াহ।" : "Alhamdu lillahil-ladhi kasani hadha wa razaqanihi min ghayri hawlim-minni wa la quwwah.",
      meaning: t('duaWearingClothesMeaning'),
      source: language === 'bn' ? "(আবু দাউদ ৪০২৩)" : "(Abu Dawud 4023)"
    },
    {
      id: 21,
      category: "Daily",
      title: t('duaEnteringToilet'),
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
      bangla: language === 'bn' ? "আল্লাহুম্মা ইন্নি আউযুবিকা মিনাল খুবুসি ওয়াল খাবাইস।" : "Allahumma inni a'udhu bika minal-khubuthi wal-khaba'ith.",
      meaning: t('duaEnteringToiletMeaning'),
      source: language === 'bn' ? "(বুখারী ১৪২)" : "(Bukhari 142)"
    },
    {
      id: 22,
      category: "Daily",
      title: t('duaLeavingToilet'),
      arabic: "غُفْرَانَكَ",
      bangla: language === 'bn' ? "গুফরানাকা।" : "Ghufranaka.",
      meaning: t('duaLeavingToiletMeaning'),
      source: language === 'bn' ? "(আবু দাউদ ৩০)" : "(Abu Dawud 30)"
    },
    {
      id: 23,
      category: "Daily",
      title: t('duaPatience'),
      arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّনَا مُسْلِمِينَ",
      bangla: language === 'bn' ? "রাব্বানা আফরিগ আলাইনা সাবরাঁ ওয়া তাওয়াফফানা মুসলিমিন।" : "Rabbana afrigh 'alayna sabran wa tawaffana Muslimin.",
      meaning: t('duaPatienceMeaning'),
      source: language === 'bn' ? "(সূরা আল-আরাফ ১২৬)" : "(Surah Al-A'raf 126)"
    },
    {
      id: 24,
      category: "Daily",
      title: t('duaGuidance'),
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
      bangla: language === 'bn' ? "আল্লাহুম্মা ইন্নি আসআলুকাল হুদা ওয়াত তুক্বা ওয়াল আফাফা ওয়াল গিনা।" : "Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina.",
      meaning: t('duaGuidanceMeaning'),
      source: language === 'bn' ? "(মুসলিম ২৭২১)" : "(Muslim 2721)"
    },
    {
      id: 25,
      category: "Daily",
      title: t('duaAfterSalah'),
      arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
      bangla: language === 'bn' ? "আল্লাহুম্মা আনতাস সালামু ওয়া মিনকাস সালামু, তাবারকতা ইয়া যাল জালালি ওয়াল ইকরাম।" : "Allahumma Antas-Salamu wa minkas-salamu, tabarakta ya Dhal-Jalali wal-Ikram.",
      meaning: t('duaAfterSalahMeaning'),
      source: language === 'bn' ? "(মুসলিম ৫৯১)" : "(Muslim 591)"
    },
    {
      id: 26,
      category: "Daily",
      title: t('duaDebt'),
      arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
      bangla: language === 'bn' ? "আল্লাহুম্মাকফিনি বিহালালিকা আন হারামিকা, ওয়া আগনিনি বিফাদলিকা আম্মান সিওয়াক।" : "Allahummak-fini bihalalika 'an haramika, wa aghnini bifadlika 'amman siwak.",
      meaning: t('duaDebtMeaning'),
      source: language === 'bn' ? "(তিরমিজি ৩৫৬৩)" : "(Tirmidhi 3563)"
    },
    {
      id: 27,
      category: "Daily",
      title: t('duaAnxiety'),
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
      bangla: language === 'bn' ? "আল্লাহুম্মা ইন্নি আউযুবিকা মিনাল হাম্মি ওয়াল হাযানি, ওয়াল আজযি ওয়াল কাসালি, ওয়াল বুখলি ওয়াল জুবনি, ওয়া দ্বালা'ইদ দাইনি ওয়া গালাবাতির রিজাল।" : "Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala'id-dayni wa ghalabatir-rijal.",
      meaning: t('duaAnxietyMeaning'),
      source: language === 'bn' ? "(বুখারী ২৮৯৩)" : "(Bukhari 2893)"
    },
    {
      id: 28,
      category: "Morning",
      title: t('duaMorningEvening'),
      arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
      bangla: language === 'bn' ? "বিসমিল্লাহিল্লাজি লা ইয়াদুরু মাআসমিহি শাইউন ফিল আরদি ওয়া লা ফিস সামাই ওয়া হুয়াস সামিউল আলিম।" : "Bismillahilladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
      meaning: t('duaMorningEveningMeaning'),
      source: language === 'bn' ? "(আবু দাউদ ৫০৮৮)" : "(Abu Dawud 5088)"
    }
  ], [t, language]);

  const categories = [
    { name: 'All', label: t('all'), icon: <BookOpen size={18} /> },
    { name: 'Morning', label: t('morning'), icon: <Sun size={18} /> },
    { name: 'Night', label: t('night'), icon: <Moon size={18} /> },
    { name: 'Daily', label: t('daily'), icon: <Coffee size={18} /> },
    { name: 'Travel', label: t('travel'), icon: <Plane size={18} /> }
  ];

  const filteredDuas = duas.filter(dua => 
    (activeCategory === 'All' || dua.category === activeCategory) &&
    (dua.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     dua.bangla.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopy = useCallback((dua: Dua) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.bangla}\n\n${dua.meaning}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="dua" className="py-20 bg-islamic-bg dark:bg-dark-bg min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary dark:text-primary mb-4">{t('dailyDua')}</h2>
          <p className="text-secondary/60 dark:text-primary/60 max-w-2xl mx-auto">{t('findPeace')}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap border text-sm ${
                  activeCategory === cat.name 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                    : 'bg-white/5 dark:bg-white/5 text-secondary dark:text-white border-primary/10 hover:border-primary/30'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
            <input 
              type="text" 
              placeholder={t('searchDua')}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-primary/10 focus:outline-none focus:border-primary bg-white/5 dark:bg-dark-card dark:text-white shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredDuas.map((dua) => (
              <motion.div
                key={dua.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="islamic-card rounded-[24px] group overflow-hidden"
              >
                {/* Header */}
                <div 
                  onClick={() => toggleExpand(dua.id)}
                  className="flex items-center justify-between p-6 cursor-pointer select-none"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {dua.title}
                    </h3>
                    {dua.source && (
                      <span className="text-sm text-white/40 font-medium font-bangla">
                        {dua.source}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: expandedId === dua.id ? 180 : 0 }}
                      className="text-white/40 group-hover:text-primary transition-colors"
                    >
                      <ChevronRight size={20} />
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <AnimatePresence>
                  {expandedId === dua.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-8 pt-2 border-t border-white/5">
                        <div className="mb-8">
                          <p className="text-3xl md:text-4xl text-right font-arabic leading-[2] text-primary drop-shadow-[0_0_10px_rgba(200,169,81,0.2)]">
                            {dua.arabic}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-6 bg-white/5 rounded-2xl border border-primary/5">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 opacity-60">
                              {t('pronunciation')}
                            </p>
                            <p className="text-white/90 font-medium text-lg font-bangla leading-relaxed">
                              {dua.bangla}
                            </p>
                          </div>
                          
                          <div className="p-6 bg-white/5 rounded-2xl border border-primary/5">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 opacity-60">
                              {t('meaning')}
                            </p>
                            <p className="text-white/70 text-base italic leading-relaxed">
                              "{dua.meaning}"
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <button 
                            onClick={() => handleCopy(dua)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:text-primary hover:bg-primary/10 transition-all text-sm font-bold border border-white/5"
                          >
                            {copiedId === dua.id ? (
                              <>
                                <Check size={16} className="text-green-500" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={16} />
                                <span>{t('copy')}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

