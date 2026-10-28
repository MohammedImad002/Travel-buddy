export type PhraseItem = {
  original: string;
  translation: string;
  pronunciation: string;
  note: string;
  category: "Essentials" | "Dining" | "Directions" | "Emergency" | "Shopping";
};

export const LANGUAGES = [
  "English",
  "Hindi",
  "Arabic",
  "French",
  "Spanish",
  "German",
  "Italian",
  "Japanese",
  "Thai",
  "Turkish",
  "Malay",
  "Mandarin Chinese",
];

// Offline Travel Phrasebook across popular destination languages
export const PHRASEBOOK: Record<string, PhraseItem[]> = {
  Arabic: [
    {
      original: "Hello, peace be upon you",
      translation: "السلام عليكم (As-salamu alaykum)",
      pronunciation: "as-sa-LAH-moo a-LAY-kum",
      note: "Standard polite greeting used everywhere across the Arab world.",
      category: "Essentials",
    },
    {
      original: "Thank you very much",
      translation: "شكراً جزيلاً (Shukran jazeelan)",
      pronunciation: "SHOOK-ran ja-ZEE-lan",
      note: "Polite and warmly received in all settings.",
      category: "Essentials",
    },
    {
      original: "How much does this cost?",
      translation: "بكم هذا؟ (Bikam hatha?)",
      pronunciation: "bee-KAM HA-tha",
      note: "Essential for shopping at traditional souks.",
      category: "Shopping",
    },
    {
      original: "Where is the nearest toilet?",
      translation: "أين أقرب دورة مياه؟ (Ayna aqrab dawrat miyah?)",
      pronunciation: "AY-na AK-rab DOW-rat mee-YAH",
      note: "Look for symbols for 'Hamam' or 'Restroom'.",
      category: "Directions",
    },
    {
      original: "Is this food halal?",
      translation: "هل هذا الطعام حلال؟ (Hal hatha al-ta'am halal?)",
      pronunciation: "hal HA-tha at-ta-AAM ha-LAAL",
      note: "In UAE and Gulf countries, all meat served is certified halal by default.",
      category: "Dining",
    },
    {
      original: "Please take me to this address",
      translation: "من فضلك خذني إلى هذا العنوان (Min fadlik khudhni ila hatha al-'unwan)",
      pronunciation: "min FAD-lak KHOODH-nee ee-la ha-tha al-oon-WAAN",
      note: "Show this on your screen directly to taxi drivers.",
      category: "Directions",
    },
    {
      original: "I need a doctor / help urgently",
      translation: "أحتاج إلى طبيب / مساعدة عاجلة (Ahtaju ila tabeeb)",
      pronunciation: "ah-TAA-joo ee-la ta-BEEB",
      note: "Emergency medical number in UAE is 998/999.",
      category: "Emergency",
    },
  ],

  Hindi: [
    {
      original: "Hello, greetings",
      translation: "नमस्ते (Namaste)",
      pronunciation: "nuh-muh-STAY",
      note: "Fold your hands with palm together at chest level for respect.",
      category: "Essentials",
    },
    {
      original: "Thank you very much",
      translation: "बहुत धन्यवाद (Bahut dhanyavaad / Shukriya)",
      pronunciation: "buh-HOOT dhun-yuh-VAAD",
      note: "'Shukriya' is also very widely understood.",
      category: "Essentials",
    },
    {
      original: "How much does this cost?",
      translation: "यह कितने का है? (Yeh kitne ka hai?)",
      pronunciation: "yay KIT-nay kaa hai",
      note: "Polite bargaining is common in street markets.",
      category: "Shopping",
    },
    {
      original: "Where is the nearest toilet?",
      translation: "शौचालय कहाँ है? (Shauchalay kahan hai?)",
      pronunciation: "show-CHAA-lay kah-HAAN hai",
      note: "You can also ask for 'washroom'.",
      category: "Directions",
    },
    {
      original: "Is this food vegetarian?",
      translation: "क्या यह खाना शाकाहारी है? (Kya yeh khana shakahari hai?)",
      pronunciation: "kya yay KHAA-naa shaa-kaa-HAA-ree hai",
      note: "Look for the green dot symbol on packaged food in India.",
      category: "Dining",
    },
    {
      original: "Please take me to this address",
      translation: "कृपया मुझे इस पते पर ले चलिए (Kripya mujhe is pate par le chaliye)",
      pronunciation: "KRIP-yaa MOO-jhay is puh-TAY pur lay CHUH-lee-yay",
      note: "Auto-rickshaws and cabs will appreciate landmarks nearby.",
      category: "Directions",
    },
    {
      original: "I need a doctor urgently",
      translation: "मुझे तुरंत डॉक्टर की ज़रूरत है (Mujhe turant doctor ki zaroorat hai)",
      pronunciation: "MOO-jhay too-RUNT DOK-tur kee zuh-ROO-rut hai",
      note: "Universal emergency number in India is 112.",
      category: "Emergency",
    },
  ],

  Japanese: [
    {
      original: "Hello / Good day",
      translation: "こんにちは (Konnichiwa)",
      pronunciation: "kon-nee-chee-wah",
      note: "Bow slightly when greeting people in shops or hotels.",
      category: "Essentials",
    },
    {
      original: "Thank you very much",
      translation: "ありがとうございます (Arigatou gozaimasu)",
      pronunciation: "ah-ree-GAH-toh go-zaye-MAHS",
      note: "The polite form to thank staff and locals.",
      category: "Essentials",
    },
    {
      original: "How much is this?",
      translation: "これはいくらですか？ (Kore wa ikura desu ka?)",
      pronunciation: "KOH-reh wah ee-KOO-rah dess kah",
      note: "Prices in Japan are fixed and displayed clearly with tax.",
      category: "Shopping",
    },
    {
      original: "Where is the toilet?",
      translation: "トイレはどこですか？ (Toire wa doko desu ka?)",
      pronunciation: "TOY-reh wah DOH-koh dess kah",
      note: "Convenience stores (7-Eleven, Lawson) and train stations always have clean restrooms.",
      category: "Directions",
    },
    {
      original: "Excuse me / Sorry",
      translation: "すみません (Sumimasen)",
      pronunciation: "soo-mee-mah-SEN",
      note: "Use to get a waiter's attention or apologize politely on crowded trains.",
      category: "Essentials",
    },
    {
      original: "Please help / Emergency",
      translation: "助けてください (Tasukete kudasai)",
      pronunciation: "tahs-KEH-teh koo-dah-SYE",
      note: "Police in Japan is 110, Ambulance/Fire is 119.",
      category: "Emergency",
    },
  ],

  French: [
    {
      original: "Hello / Good day",
      translation: "Bonjour",
      pronunciation: "bon-ZHOOR",
      note: "Always say 'Bonjour' before asking a question in France, it is essential etiquette.",
      category: "Essentials",
    },
    {
      original: "Thank you very much",
      translation: "Merci beaucoup",
      pronunciation: "MEHR-see boh-KOO",
      note: "Warm and courteous in any situation.",
      category: "Essentials",
    },
    {
      original: "How much is this?",
      translation: "Combien ça coûte ?",
      pronunciation: "com-BYEN sah KOOT",
      note: "Useful in bakeries and markets.",
      category: "Shopping",
    },
    {
      original: "The bill, please",
      translation: "L'addition, s'il vous plaît",
      pronunciation: "lah-dee-SYON seel voo PLAY",
      note: "In French restaurants, servers won't bring the bill until you ask.",
      category: "Dining",
    },
    {
      original: "Where is the station?",
      translation: "Où est la gare / le métro ?",
      pronunciation: "oo ay lah GAHR / luh may-TROH",
      note: "Key for navigating Paris transit.",
      category: "Directions",
    },
  ],

  Thai: [
    {
      original: "Hello",
      translation: "สวัสดี (Sawatdee khrap / ka)",
      pronunciation: "sah-waht-DEE krahp (men) / kah (women)",
      note: "Add 'khrap' if male, 'ka' if female for polite speech with hands in Wai gesture.",
      category: "Essentials",
    },
    {
      original: "Thank you",
      translation: "ขอบคุณ (Khop khun khrap / ka)",
      pronunciation: "kop-KOON krahp / kah",
      note: "Universal courtesy in Thailand.",
      category: "Essentials",
    },
    {
      original: "Not spicy, please",
      translation: "ไม่เผ็ดครับ/ค่ะ (Mai phet khrap / ka)",
      pronunciation: "mye PET krahp / kah",
      note: "Crucial when ordering street food if you prefer mild food.",
      category: "Dining",
    },
    {
      original: "How much?",
      translation: "เท่าไหร่ (Thao rai?)",
      pronunciation: "tow-RYE krahp / kah",
      note: "Use at night markets and tuk-tuk negotiations.",
      category: "Shopping",
    },
  ],
};

export function getPhrasebookForLanguage(targetLanguage: string): PhraseItem[] {
  return PHRASEBOOK[targetLanguage] ?? PHRASEBOOK["Arabic"]!;
}

/**
 * Instant travel translation for custom inputs
 */
export function getSmartTranslation(
  text: string,
  from: string,
  to: string
): { translation: string; pronunciation: string; note: string } {
  const norm = text.trim().toLowerCase();

  // Search existing phrasebook first
  const list = PHRASEBOOK[to] || [];
  for (const item of list) {
    if (item.original.toLowerCase().includes(norm) || norm.includes(item.original.toLowerCase())) {
      return {
        translation: item.translation,
        pronunciation: item.pronunciation,
        note: item.note,
      };
    }
  }

  // Common quick travel phrase translations
  if (to === "Arabic") {
    if (norm.includes("water")) {
      return { translation: "ماء (Maa')", pronunciation: "maa", note: "Ask for 'Maa' barid' for cold water." };
    }
    if (norm.includes("yes")) {
      return { translation: "نعم (Na'am)", pronunciation: "na-am", note: "Polite affirmative." };
    }
    if (norm.includes("no")) {
      return { translation: "لا (Laa)", pronunciation: "laa", note: "Simple polite refusal." };
    }
  }

  return {
    translation: `${text} (${to})`,
    pronunciation: `[Pronounced as spoken in ${to}]`,
    note: `Speak clearly or show this text to locals in ${to}.`,
  };
}
