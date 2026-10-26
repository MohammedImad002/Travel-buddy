# Travel Buddy — roadmap

Built:
- [x] Design system (frosted glass) + phone shell with bottom nav
- [x] Home hub (live time, weather, tool grid, time check)
- [x] Translator
- [x] Currency converter (live rates)
- [x] World clock
- [x] Nearby places
- [x] Food finder
- [x] Explore
- [x] Travel AI assistant chat
- [x] Travel essentials (packing, itinerary, weather, emergency, tips)
- [x] Per-route head metadata

Debug pass (Sep 23):
- [x] World clock: build times in the browser only, so the screen no longer breaks on load
- [x] Home time: build date and times in the browser only to prevent locale hydration mismatches
- [x] AI failures: read the real status from the stream's error part (the SDK wrapper hid it)
- [x] AI failures: show the actual reason everywhere — out of credits, blocked, busy, not configured
- [x] Verified in browser: clock ticks, currency works, all six AI screens report the real reason
- [x] Re-run a full AI pass (translate, places, food, explore, assistant, tips) once AI credits are topped up

New travel features (Sep 28):
- [x] Use “budget-friendly” throughout pricing copy
- [x] Add a global SOS call button using the selected destination's emergency number
- [x] Add nearby local stays, fuel and EV charging, vehicle rentals, mosques, and temples
- [x] Add inclusive travel creator video links
- [x] Add pre-travel scam and tourist-trap guidance
- [x] Add souvenir shopping suggestions with area and price tier

Location controls (Sep 28):
- [x] Let travelers type and search their home/current location and destination
- [x] Add “Track my location” wherever a current location can be selected
- [x] Resolve device coordinates to a city and country, such as Bangalore, India
- [x] Keep home, current location, and destination synchronized across all tools
