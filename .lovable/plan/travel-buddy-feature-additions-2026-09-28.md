# Travel Buddy feature additions

## What will be added

- Put an always-available **SOS** call control in the existing top bar. It will call the emergency number for the selected destination and clearly display that number.
- Expand **Nearby** with local stays and homestays, EV charging, petrol stations, car rentals, bike and scooter rentals, mosques, and temples.
- Expand **Explore** with souvenirs and shopping. Results will show where to buy each item and label it **budget-friendly**, **mid-range**, or **premium**.
- Add a compact **Travel videos** section in Explore with destination searches from both Muslim and general-interest travel creators.
- Add **Things to know before travelling** in Essentials, covering common scams, pickpockets, money-exchange scams, and tourist traps.
- Replace any user-facing or generated use of “cheap” with “budget-friendly.”

## Preserve existing behavior

- Keep the current frosted-glass visual style, mobile layout, navigation, and all existing screens.
- Leave Currency unchanged.
- Reuse the selected destination across every new feature.
- Keep current error handling for AI-powered recommendations, including the existing credits message when AI access is paused.

## Technical details

- Reuse the existing nearby-place request and result cards for the new place categories.
- Add a small destination-aware shopping request so souvenir results have structured item, buying area, and price-tier information.
- Keep safety guidance and curated creator links available without requiring AI credits.
- Validate the result in the running mobile preview and confirm all existing routes still build.