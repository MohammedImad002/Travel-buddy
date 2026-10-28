import type { City } from "./cities";

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export const QUICK_SUGGESTIONS = [
  "What can I do near me today?",
  "Find a halal restaurant nearby",
  "Plan my day",
  "How do I get around on a budget?",
];

// Offline Intelligent Travel Brain providing real, concrete recommendations
export function generateLocalTravelAdvice(question: string, city: City): string {
  const q = question.toLowerCase();

  if (q.includes("halal") || q.includes("food") || q.includes("eat") || q.includes("restaurant") || q.includes("dinner")) {
    if (city.id === "dubai") {
      return (
        `In ${city.name}, all meat served is certified halal by law.\n\n` +
        `• Budget-friendly: Head to Al Ustad Special Kabab in Meena Bazaar (Al Fahidi). World-famous tender charcoal skewers for around 35-50 AED.\n` +
        `• Local flair: Arabian Tea House in the historic Al Fahidi district for Emirati breakfast and saffron tea (approx. 60-80 AED).\n` +
        `• Evening views: Time Out Market at Souk Al Bahar overlooking the Burj Khalifa fountain show.`
      );
    }
    if (city.id === "delhi") {
      return (
        `Delicious dining spots in ${city.name}:\n\n` +
        `• Halal Mughlai: Karim's or Al Jawahar opposite Jama Masjid Gate 1 in Old Delhi. Mutton korma and seekh kebabs (approx. ₹300-600 per person).\n` +
        `• Vegetarian: Saravanaa Bhavan in Connaught Place Outer Circle for crispy ghee roast dosas and South Indian filter coffee (₹250-400).\n` +
        `• Street Food: Natraj Dahi Bhalle and Paranthe Wali Gali in Chandni Chowk.`
      );
    }
    return (
      `Great dining options in ${city.name}:\n\n` +
      `• Look for popular local spots with high turnover and busy dining rooms.\n` +
      `• For budget-friendly options, visit local food courts, street stalls, and neighbourhood family eateries where meals range between ${city.currency} 10-25.\n` +
      `• Always check recent diner reviews and ask staff for their signature dish!`
    );
  }

  if (q.includes("budget") || q.includes("get around") || q.includes("metro") || q.includes("transport") || q.includes("taxi")) {
    if (city.id === "dubai") {
      return (
        `Getting around ${city.name} on a budget:\n\n` +
        `• Dubai Metro: Buy a Silver Nol Card (25 AED, includes 19 AED credit). Fares start from just 3 AED per zone.\n` +
        `• Abra Boat Ride: Take a traditional wooden abra across Dubai Creek between Deira and Bur Dubai for only 1 AED cash!\n` +
        `• Careem / Taxis: Use the Careem app for official RTA metered taxis with zero surge surprises.`
      );
    }
    if (city.id === "delhi") {
      return (
        `Getting around ${city.name} smoothly:\n\n` +
        `• Delhi Metro: The best and fastest way to beat traffic. Air-conditioned, world-class, with fares between ₹10 and ₹60.\n` +
        `• Auto-rickshaws: Always ask for the meter or book via Uber Auto / Ola to lock in fair, fixed pricing.\n` +
        `• Airport Express: Direct train from Terminal 3 to New Delhi Railway Station in just 19 minutes for ₹60.`
      );
    }
    return (
      `Budget transport in ${city.name}:\n\n` +
      `• Public Transit: Pick up a rechargeable transit card at the airport or main rail station for 20-40% savings on single fares.\n` +
      `• Walking: Most historic city centres are best explored on foot.\n` +
      `• Ride-hailing: Compare local apps with licensed metered taxis before booking.`
    );
  }

  if (q.includes("plan") || q.includes("day") || q.includes("itinerary")) {
    return (
      `Here is a balanced 1-day itinerary for ${city.name}:\n\n` +
      `• 09:00 AM — Morning heritage walk through the historic district and main landmark before the midday heat.\n` +
      `• 12:30 PM — Budget-friendly lunch at an authentic local eatery or food market.\n` +
      `• 02:30 PM — Indoor museum, cultural center, or artisan market during the afternoon.\n` +
      `• 05:30 PM — Sunset viewpoint, waterfront stroll, or scenic rooftop.\n` +
      `• 07:30 PM — Evening dinner followed by illuminated night sights.`
    );
  }

  // Default smart guidance
  return (
    `Welcome to ${city.name}, ${city.country}!\n\n` +
    `• Emergency Services: Dial ${city.emergency} for immediate assistance.\n` +
    `• Local Currency: ${city.currency} (card payments widely accepted in most venues, but keep a little cash for street vendors).\n` +
    `• Official Language: ${city.language}.\n` +
    `• Tap "Nearby" to find vetted spots, or "Essentials" for your packing checklist and local safety advisories.`
  );
}
