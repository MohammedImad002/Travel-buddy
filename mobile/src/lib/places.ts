export type Place = {
  name: string;
  category: string;
  area: string;
  description: string;
  priceLevel: string; // $, $$, $$$
  rating: number; // e.g. 4.6
  openHint: string; // e.g. "Open till 11 PM"
  query?: string; // Search query for maps
};

export type Souvenir = {
  item: string;
  buyAt: string;
  area: string;
  why: string;
  priceTier: "Budget-friendly" | "Mid-range" | "Premium";
};

// Destination-specific curated places database
export const CURATED_PLACES: Record<string, Place[]> = {
  dubai: [
    {
      name: "Al Ustad Special Kabab",
      category: "Restaurants",
      area: "Al Fahidi / Meena Bazaar",
      description: "Legendary Iranian charcoal-grilled kebabs served since 1978. A true Dubai heritage icon.",
      priceLevel: "$",
      rating: 4.8,
      openHint: "Open 12 PM - 1 AM",
    },
    {
      name: "Arabian Tea House",
      category: "Cafés",
      area: "Al Fahidi Historical Neighbourhood",
      description: "Charming courtyard café serving traditional Emirati breakfast, saffron tea, and fresh bread.",
      priceLevel: "$$",
      rating: 4.7,
      openHint: "Open 7:30 AM - 11 PM",
    },
    {
      name: "Burj Khalifa & Dubai Mall",
      category: "Attractions",
      area: "Downtown Dubai",
      description: "World's tallest skyscraper with observation deck and the largest retail & entertainment hub.",
      priceLevel: "$$$",
      rating: 4.9,
      openHint: "Open 10 AM - 12 AM",
    },
    {
      name: "Gold & Spice Souks",
      category: "Shopping",
      area: "Deira Old Town",
      description: "Historic aromatic spice alleyways and shimmering gold arcade across Dubai Creek.",
      priceLevel: "$$",
      rating: 4.6,
      openHint: "Open 9 AM - 10 PM",
    },
    {
      name: "Al Farooq Omar Bin Al Khattab Mosque",
      category: "Mosques",
      area: "Al Safa",
      description: "Stunning Blue Mosque inspired architecture welcoming visitors with guided cultural tours.",
      priceLevel: "Free",
      rating: 4.9,
      openHint: "Open 9 AM - 8 PM",
    },
    {
      name: "Rashid Hospital & Emergency Centre",
      category: "Hospitals",
      area: "Oud Metha",
      description: "Major government emergency trauma hospital with 24/7 world-class triage.",
      priceLevel: "$$",
      rating: 4.5,
      openHint: "Open 24/7",
    },
    {
      name: "Supercare Pharmacy Deira",
      category: "Pharmacies",
      area: "Al Rigga, Deira",
      description: "Well-stocked round-the-clock pharmacy with travel medicine and first-aid essentials.",
      priceLevel: "$$",
      rating: 4.6,
      openHint: "Open 24/7",
    },
    {
      name: "DEWA EV Green Charger Downtown",
      category: "EV charge",
      area: "Mohammed Bin Rashid Blvd",
      description: "Ultra-fast public EV charging station located near Dubai Mall entrance.",
      priceLevel: "$",
      rating: 4.4,
      openHint: "Open 24/7",
    },
  ],

  delhi: [
    {
      name: "Karim's Historic Mughlai",
      category: "Restaurants",
      area: "Old Delhi (Jama Masjid)",
      description: "Famous mutton seekh kebabs, korma and tandoori rotis served since 1913.",
      priceLevel: "$",
      rating: 4.7,
      openHint: "Open 9 AM - 12:30 AM",
    },
    {
      name: "Saravanaa Bhavan",
      category: "Restaurants",
      area: "Connaught Place",
      description: "Authentic South Indian ghee roast dosas, idlis, and filter coffee in central Delhi.",
      priceLevel: "$",
      rating: 4.6,
      openHint: "Open 8 AM - 11 PM",
    },
    {
      name: "Red Fort & Chandni Chowk",
      category: "Attractions",
      area: "Old Delhi",
      description: "UNESCO World Heritage Mughal palace and centuries-old vibrant spice market lanes.",
      priceLevel: "$",
      rating: 4.7,
      openHint: "Open 9:30 AM - 4:30 PM",
    },
    {
      name: "Dilli Haat Crafts Market",
      category: "Shopping",
      area: "INA, South Delhi",
      description: "Open-air artisan crafts bazaar with handmade textiles and regional food stalls.",
      priceLevel: "$",
      rating: 4.6,
      openHint: "Open 10:30 AM - 10 PM",
    },
    {
      name: "Jama Masjid Delhi",
      category: "Mosques",
      area: "Chandni Chowk",
      description: "One of the largest mosques in India, built by Emperor Shah Jahan in 1656.",
      priceLevel: "Free",
      rating: 4.8,
      openHint: "Open 7 AM - 6:30 PM",
    },
    {
      name: "Akshardham Temple",
      category: "Temples",
      area: "Noida Mor, East Delhi",
      description: "Monumental Hindu temple complex with intricate sandstone carvings and water show.",
      priceLevel: "Free",
      rating: 4.9,
      openHint: "Open 10 AM - 8 PM",
    },
    {
      name: "AIIMS New Delhi Emergency",
      category: "Hospitals",
      area: "Ansari Nagar",
      description: "Premier apex public hospital in India with 24/7 emergency medical trauma care.",
      priceLevel: "$",
      rating: 4.6,
      openHint: "Open 24/7",
    },
    {
      name: "Apollo Pharmacy Connaught Place",
      category: "Pharmacies",
      area: "Outer Circle, CP",
      description: "Reliable 24-hour pharmacy with certified medicines and travel medical kits.",
      priceLevel: "$",
      rating: 4.5,
      openHint: "Open 24/7",
    },
  ],

  mumbai: [
    {
      name: "Bademiya Kebabs",
      category: "Restaurants",
      area: "Colaba Causeway",
      description: "Famous open-air late-night street barbecue serving juicy chicken tikka rolls.",
      priceLevel: "$",
      rating: 4.5,
      openHint: "Open 12 PM - 3 AM",
    },
    {
      name: "Gateway of India & Marine Drive",
      category: "Attractions",
      area: "South Mumbai",
      description: "Iconic colonial basalt arch facing Mumbai harbour, followed by a Queen's Necklace stroll.",
      priceLevel: "Free",
      rating: 4.8,
      openHint: "Open all day",
    },
    {
      name: "Haji Ali Dargah",
      category: "Mosques",
      area: "Worli Bay",
      description: "15th-century mosque and tomb built on an islet connected by a walking causeway.",
      priceLevel: "Free",
      rating: 4.7,
      openHint: "Open 6 AM - 10 PM",
    },
    {
      name: "Siddhivinayak Ganapati Temple",
      category: "Temples",
      area: "Prabhadevi",
      description: "Revered historic temple dedicated to Lord Ganesha, attracting pilgrims worldwide.",
      priceLevel: "Free",
      rating: 4.9,
      openHint: "Open 5:30 AM - 10 PM",
    },
    {
      name: "Lilavati Hospital & Research Centre",
      category: "Hospitals",
      area: "Bandra West",
      description: "Top multi-specialty hospital with 24/7 emergency critical care unit.",
      priceLevel: "$$",
      rating: 4.6,
      openHint: "Open 24/7",
    },
    {
      name: "Colaba Causeway Street Bazaar",
      category: "Shopping",
      area: "Colaba",
      description: "Bustling street stalls for antique brass, bohemian clothing, jewellery, and souvenirs.",
      priceLevel: "$",
      rating: 4.6,
      openHint: "Open 11 AM - 10 PM",
    },
  ],

  singapore: [
    {
      name: "Lau Pa Sat Hawker Festival",
      category: "Restaurants",
      area: "Downtown Raffles Quay",
      description: "Historic Victorian cast-iron market with famous outdoor evening Satay Street.",
      priceLevel: "$",
      rating: 4.7,
      openHint: "Open 24/7",
    },
    {
      name: "Gardens by the Bay",
      category: "Attractions",
      area: "Marina South",
      description: "Futuristic park featuring 50m Supertrees, Cloud Forest waterfall dome, and skyway.",
      priceLevel: "$$",
      rating: 4.9,
      openHint: "Open 5 AM - 2 AM",
    },
    {
      name: "Sultan Mosque (Masjid Sultan)",
      category: "Mosques",
      area: "Kampong Glam / Arab St",
      description: "Focal point of historic Malay-Arab heritage district with massive gold dome.",
      priceLevel: "Free",
      rating: 4.8,
      openHint: "Open 9:30 AM - 5:30 PM",
    },
    {
      name: "Singapore General Hospital (SGH)",
      category: "Hospitals",
      area: "Outram Park",
      description: "Singapore's flagship tertiary hospital with premier 24-hour emergency department.",
      priceLevel: "$$",
      rating: 4.7,
      openHint: "Open 24/7",
    },
    {
      name: "Haji Lane Boutiques",
      category: "Shopping",
      area: "Bugis / Kampong Glam",
      description: "Vibrant indie street adorned with murals, trendy fashion boutiques, and cafés.",
      priceLevel: "$$",
      rating: 4.6,
      openHint: "Open 11 AM - 9 PM",
    },
  ],

  london: [
    {
      name: "Dishoom Covent Garden",
      category: "Restaurants",
      area: "Covent Garden",
      description: "Tribute to Bombay's old Irani cafés; famous for house black daal and bacon naan rolls.",
      priceLevel: "$$",
      rating: 4.7,
      openHint: "Open 8 AM - 11 PM",
    },
    {
      name: "Borough Market",
      category: "Shopping",
      area: "Southwark / London Bridge",
      description: "Historic 1,000-year-old gourmet food market with artisan cheese, pastries, and street eats.",
      priceLevel: "$$",
      rating: 4.8,
      openHint: "Open 10 AM - 5 PM",
    },
    {
      name: "British Museum",
      category: "Attractions",
      area: "Bloomsbury",
      description: "World-renowned history and culture museum with Rosetta Stone and Parthenon sculptures.",
      priceLevel: "Free",
      rating: 4.9,
      openHint: "Open 10 AM - 5 PM",
    },
    {
      name: "St Thomas' Hospital Emergency",
      category: "Hospitals",
      area: "Westminster Bridge",
      description: "Central NHS teaching hospital facing Big Ben with 24/7 A&E emergency services.",
      priceLevel: "Free / NHS",
      rating: 4.6,
      openHint: "Open 24/7",
    },
  ],

  tokyo: [
    {
      name: "Ichiran Shibuya Ramen",
      category: "Restaurants",
      area: "Shibuya",
      description: "World-famous rich tonkotsu broth ramen with customizable noodle firmness in private booths.",
      priceLevel: "$",
      rating: 4.7,
      openHint: "Open 24/7",
    },
    {
      name: "Senso-ji Temple & Nakamise-dori",
      category: "Attractions",
      area: "Asakusa",
      description: "Tokyo's oldest Buddhist temple founded in 645 AD, flanked by traditional snack stalls.",
      priceLevel: "Free",
      rating: 4.8,
      openHint: "Open 6 AM - 5 PM",
    },
    {
      name: "Tokyo Camii & Diyanet Mosque",
      category: "Mosques",
      area: "Yoyogi-Uehara, Shibuya",
      description: "Exquisite Ottoman-style mosque and cultural centre with Turkish marble and calligraphy.",
      priceLevel: "Free",
      rating: 4.8,
      openHint: "Open 10 AM - 6 PM",
    },
    {
      name: "St. Luke's International Hospital",
      category: "Hospitals",
      area: "Tsukiji, Chuo City",
      description: "English-speaking international hospital with premier 24-hour emergency department.",
      priceLevel: "$$",
      rating: 4.7,
      openHint: "Open 24/7",
    },
  ],

  paris: [
    {
      name: "Café de Flore",
      category: "Cafés",
      area: "Saint-Germain-des-Prés",
      description: "Historic literary café frequented by Sartre and Hemingway. Try the hot chocolate.",
      priceLevel: "$$",
      rating: 4.4,
      openHint: "Open 7:30 AM - 1:30 AM",
    },
    {
      name: "Eiffel Tower & Champ de Mars",
      category: "Attractions",
      area: "7th Arrondissement",
      description: "Gustave Eiffel's 1889 wrought-iron masterpiece offering panoramic vistas of Paris.",
      priceLevel: "$$",
      rating: 4.8,
      openHint: "Open 9:30 AM - 11 PM",
    },
    {
      name: "Grande Mosquée de Paris",
      category: "Mosques",
      area: "5th Arrondissement (Latin Quarter)",
      description: "Moorish architectural jewel with peaceful mosaic courtyards, hammam, and mint tea salon.",
      priceLevel: "$",
      rating: 4.7,
      openHint: "Open 9 AM - 6 PM",
    },
    {
      name: "Hôtel-Dieu Hospital Emergency",
      category: "Hospitals",
      area: "Île de la Cité (next to Notre-Dame)",
      description: "Oldest hospital in Paris with 24/7 central emergency and urgent medical care.",
      priceLevel: "$$",
      rating: 4.5,
      openHint: "Open 24/7",
    },
  ],

  bangkok: [
    {
      name: "Thip Samai Pad Thai",
      category: "Restaurants",
      area: "Maha Chai Rd, Phra Nakhon",
      description: "Legendary restaurant renowned for the ultimate shrimp pad thai wrapped in thin egg omelette.",
      priceLevel: "$",
      rating: 4.6,
      openHint: "Open 9 AM - 12 AM",
    },
    {
      name: "Wat Pho (Reclining Buddha)",
      category: "Attractions",
      area: "Phra Nakhon",
      description: "Majestic 46-metre gold leaf reclining Buddha and birth home of traditional Thai massage.",
      priceLevel: "$",
      rating: 4.8,
      openHint: "Open 8 AM - 6:30 PM",
    },
    {
      name: "Chatuchak Weekend Market",
      category: "Shopping",
      area: "Kamphaeng Phet",
      description: "Over 15,000 stalls selling vintage clothing, handcrafted souvenirs, street food, and silks.",
      priceLevel: "$",
      rating: 4.7,
      openHint: "Fri-Sun 9 AM - 6 PM",
    },
    {
      name: "Bumrungrad International Hospital",
      category: "Hospitals",
      area: "Sukhumvit Soi 3",
      description: "Globally accredited world-class hospital catering to travelers with 24/7 multi-lingual ER.",
      priceLevel: "$$",
      rating: 4.8,
      openHint: "Open 24/7",
    },
  ],

  istanbul: [
    {
      name: "Hafiz Mustafa 1864",
      category: "Cafés",
      area: "Sirkeci / Sultanahmet",
      description: "Heritage confectionery serving authentic Turkish delight, pistachio baklava, and Turkish coffee.",
      priceLevel: "$$",
      rating: 4.8,
      openHint: "Open 24/7",
    },
    {
      name: "Hagia Sophia & Blue Mosque",
      category: "Attractions",
      area: "Sultanahmet Square",
      description: "Ancient Byzantine cathedral turned mosque with colossal dome and 6 minarets.",
      priceLevel: "Free",
      rating: 4.9,
      openHint: "Open 9 AM - 7 PM",
    },
    {
      name: "Grand Bazaar (Kapalıçarşı)",
      category: "Shopping",
      area: "Beyazıt",
      description: "One of the world's oldest covered markets with 4,000 shops selling carpets, spices, and ceramics.",
      priceLevel: "$$",
      rating: 4.7,
      openHint: "Open 8:30 AM - 7 PM",
    },
  ],

  newyork: [
    {
      name: "Katz's Delicatessen",
      category: "Restaurants",
      area: "Lower East Side",
      description: "Iconic Jewish deli since 1888 legendary for towering hand-carved hot pastrami on rye.",
      priceLevel: "$$",
      rating: 4.7,
      openHint: "Open 8 AM - 11 PM",
    },
    {
      name: "Central Park & The Met",
      category: "Attractions",
      area: "Manhattan",
      description: "843 acres of peaceful green oasis in the heart of NYC, adjacent to the Metropolitan Museum.",
      priceLevel: "Free",
      rating: 4.9,
      openHint: "Open 6 AM - 1 AM",
    },
    {
      name: "Mount Sinai Hospital Emergency",
      category: "Hospitals",
      area: "Upper East Side",
      description: "Top-ranked academic medical emergency center with 24/7 trauma triage.",
      priceLevel: "$$$",
      rating: 4.6,
      openHint: "Open 24/7",
    },
  ],
};

// Curated authentic souvenirs database
export const CURATED_SOUVENIRS: Record<string, Souvenir[]> = {
  dubai: [
    {
      item: "Authentic Camel Milk Chocolate",
      buyAt: "Al Nassma Boutique, Dubai Mall",
      area: "Downtown Dubai",
      why: "Unique local luxury treat made with premium UAE camel milk and Arabic spices.",
      priceTier: "Mid-range",
    },
    {
      item: "Bateel Gourmet Stuffed Dates",
      buyAt: "Bateel Boutique, Mall of the Emirates",
      area: "Al Barsha",
      why: "Hand-picked organic dates stuffed with candied ginger, orange peel, and nuts.",
      priceTier: "Mid-range",
    },
    {
      item: "Pure Oud & Attar Perfume Oil",
      buyAt: "Deira Perfume Souk",
      area: "Old Deira",
      why: "Traditional long-lasting concentrated fragrance blends distilled locally.",
      priceTier: "Budget-friendly",
    },
    {
      item: "Emirati Coffee Dallah Pot",
      buyAt: "Deira Spice Souk",
      area: "Al Ras",
      why: "Iconic brass coffee pot symbolizing traditional Arab generosity and hospitality.",
      priceTier: "Budget-friendly",
    },
  ],

  delhi: [
    {
      item: "Pashmina Cashmere Shawl",
      buyAt: "Kashmir Government Arts Emporium, Baba Kharak Singh Marg",
      area: "Connaught Place",
      why: "Certified ultra-soft authentic hand-woven cashmere with GI hallmark.",
      priceTier: "Mid-range",
    },
    {
      item: "Indian CTC & Darjeeling Tea",
      buyAt: "Mittal Teas",
      area: "Sundar Nagar Market",
      why: "First-flush Darjeeling and fragrant Assam spiced chai leaves direct from tea estates.",
      priceTier: "Budget-friendly",
    },
    {
      item: "Hand-Block Printed Cotton Kurtas",
      buyAt: "Fabindia or Anokhi",
      area: "Khan Market",
      why: "Traditional natural vegetable dye woodblock prints crafted by Indian artisans.",
      priceTier: "Budget-friendly",
    },
    {
      item: "Brass & Sandalwood Handicrafts",
      buyAt: "Dilli Haat Crafts Bazaar",
      area: "INA",
      why: "Direct fair-trade handicrafts sold by regional craftsmen from across India.",
      priceTier: "Budget-friendly",
    },
  ],

  mumbai: [
    {
      item: "Kolhapuri Handcrafted Leather Chappals",
      buyAt: "Colaba Causeway Footwear Stalls",
      area: "Colaba",
      why: "Durable traditional braided leather sandals from Maharashtra.",
      priceTier: "Budget-friendly",
    },
    {
      item: "Mumbai Cutting Chai Glasses & Stand",
      buyAt: "Crawford Market Handicraft Alley",
      area: "Fort",
      why: "Iconic vintage wire caddy with fluted tea glasses seen at every Mumbai chai stall.",
      priceTier: "Budget-friendly",
    },
    {
      item: "Maharashtrian Mango Alphonso Barfi",
      buyAt: "Brijwasi Sweets",
      area: "Churchgate",
      why: "Rich sweet confection made from genuine Ratnagiri Alphonso mangoes.",
      priceTier: "Budget-friendly",
    },
  ],

  singapore: [
    {
      item: "Kaya Coconut Jam & Toast Set",
      buyAt: "Ya Kun Kaya Toast Outlet",
      area: "Far East Square",
      why: "Sweet coconut egg spread infused with pandan, the quintessential Singapore breakfast.",
      priceTier: "Budget-friendly",
    },
    {
      item: "Salted Egg Fish Skin Snack",
      buyAt: "Irvins Salted Egg Boutique",
      area: "Jewel Changi Airport",
      why: "Dangerously addictive crispy fish skin tossed in creamy curry leaf salted egg yolk.",
      priceTier: "Budget-friendly",
    },
    {
      item: "Peranakan Beaded Slippers & Ceramics",
      buyAt: "Rumah Kim Choo",
      area: "Joo Chiat / Katong",
      why: "Colorful heritage Straits-Chinese beaded craftsmanship and pastel tiles.",
      priceTier: "Mid-range",
    },
  ],

  tokyo: [
    {
      item: "Tokyo Banana & Matcha KitKats",
      buyAt: "Tokyo Station Gift Arcade",
      area: "Marunouchi",
      why: "Fluffy banana custard sponge cakes and seasonal Japanese specialty snacks.",
      priceTier: "Budget-friendly",
    },
    {
      item: "Handmade Japanese Kitchen Knife (Santoku)",
      buyAt: "Kappabashi Kitchen Town",
      area: "Taito City",
      why: "World-class forged carbon steel knife with razor sharpness for culinary lovers.",
      priceTier: "Premium",
    },
    {
      item: "Washi Paper Stationery & Fan",
      buyAt: "Itoya Ginza",
      area: "Ginza",
      why: "Centuries-old mulberry paper crafted into exquisite notebooks and folded fans.",
      priceTier: "Budget-friendly",
    },
  ],

  london: [
    {
      item: "Fortnum & Mason Royal Tea Tin",
      buyAt: "Fortnum & Mason Flagship Store",
      area: "Piccadilly",
      why: "Royal warrant loose leaf Royal Blend tea in iconic eau-de-nil tins.",
      priceTier: "Mid-range",
    },
    {
      item: "Scottish Cashmere Scarf",
      buyAt: "Johnstons of Elgin / Regent Street",
      area: "Mayfair",
      why: "Pure woven Scottish cashmere spun in Elgin since 1797.",
      priceTier: "Premium",
    },
    {
      item: "Artisan Marmalade & Shortbread",
      buyAt: "Borough Market Bakeries",
      area: "London Bridge",
      why: "Authentic all-butter Scottish shortbread fingers and Seville orange marmalade.",
      priceTier: "Budget-friendly",
    },
  ],
};

// Generates fallback places for any city or custom category
export function getPlacesForCity(cityId: string, category?: string): Place[] {
  const normId = cityId.toLowerCase();
  const list = CURATED_PLACES[normId] ?? CURATED_PLACES["dubai"]!;
  if (!category || category === "all") return list;

  const filtered = list.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
  return filtered.length > 0 ? filtered : list;
}

export function getSouvenirsForCity(cityId: string): Souvenir[] {
  const normId = cityId.toLowerCase();
  return CURATED_SOUVENIRS[normId] ?? CURATED_SOUVENIRS["dubai"]!;
}
