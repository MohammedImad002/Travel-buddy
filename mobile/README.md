# ✈️ Travel Buddy — Mobile App (React Native / Expo)

A beautiful, standalone mobile application for **Travel Buddy**, built with **React Native**, **Expo**, and **TypeScript**.

---

## 📱 Features

- **🏠 Home Screen**:
  - Live local date & real-time ticking clock for your destination.
  - Live Weather widget with current temperature, condition emoji, high/low, and wind speed (powered by Open-Meteo).
  - Quick Tools Grid: Translator, Currency Converter, World Clock, Nearby Places, Food Finder, Explore, AI Assistant, and Essentials.
  - Curated travel guides by top creators (Muslim Travel Girl, Have Halal Will Travel, Kara and Nate, Drew Binsky).
  - 🚨 **Instant SOS Emergency Dialing**: One-tap emergency call to local police/ambulance/emergency services (`112` / `999` / `911`).
- **📍 Nearby Places**:
  - 15 category filters (Restaurants, Hotels, Cafés, Shopping, Hospitals, Pharmacies, Attractions, Mosques, Temples, EV charge, etc.).
  - Rich cards with ratings, price tiers, descriptions, and one-tap **Google Maps / Apple Maps directions**.
- **🍴 Food Finder**:
  - Filter by cuisine: Halal, Indian, Vegetarian, Vegan, Street Food, Seafood, Cafés, Desserts.
  - Live instant search bar with ratings, locations, and directions.
- **🗺️ Explore & Souvenirs**:
  - Mood filters: Must-see landmarks, Outdoors, Hidden gems, With kids, Evening.
  - **Authentic Souvenir Shopping Guide**: Curated items to take home, real markets to buy from, and budget tiers.
- **🤖 Ask AI Travel Assistant**:
  - Conversational travel assistant with multi-turn memory.
  - Instant quick-prompt pills.
  - Intelligent advice tailored to each city, culture, local currency, and budget options.
  - Text-to-speech voice playback.
- **🌐 Travel Translator**:
  - 12 major languages: English, Hindi, Arabic, French, Spanish, German, Italian, Japanese, Thai, Turkish, Malay, Mandarin Chinese.
  - Essential travel phrasebook with simple latin phonetic pronunciation and cultural usage tips.
  - Custom phrase translation with voice playback.
- **💱 Currency Converter**:
  - Live exchange rates fetched daily.
  - Instant conversion between home and destination currencies.
  - Quick amount buttons (+10, +50, +100, +500).
  - Popular world currencies comparison table.
- **🕐 World Clock**:
  - Dual home vs destination synchronized clocks.
  - Offset badge showing exact hours ahead or behind.
  - Clocks for 8+ major world capitals.
- **🧳 Travel Essentials & Safety**:
  - Interactive packing checklist with progress percentage (saved offline).
  - Day-by-day itinerary planner (saved offline).
  - 3-day weather forecast.
  - Travel safety & scam awareness cards (Pickpockets, currency exchange scams, tourist traps, distraction tactics).
- **🌍 14 Curated Global Destinations**:
  - Mumbai, New Delhi, Dubai, Singapore, Bangkok, Tokyo, Istanbul, London, Paris, Rome, New York, Sydney, Kuala Lumpur, Cape Town.
  - GPS auto-locate closest city button.

---

## 🚀 Running the App

### 1. Start Development Server
```bash
cd mobile
npm start
```

### 2. View on your Phone
1. Install **Expo Go** from Google Play Store or Apple App Store.
2. Scan the QR code shown in your terminal.

### 3. View in Web Browser
```bash
cd mobile
npm run web
```

---

## 📦 Building the Android APK

You can build an installable `.apk` file using either of the following methods:

### Method 1: Cloud Build with EAS (Recommended & Easiest)
This creates a standalone `.apk` directly in the cloud without needing to install Android Studio or the 15 GB Android SDK locally:

1. Log in or create a free Expo account:
   ```bash
   npx eas-cli login
   ```
2. Build the APK:
   ```bash
   npx eas-cli build -p android --profile preview
   ```
3. Once completed, EAS will provide a direct download URL and QR code for your `.apk` file!

### Method 2: Local APK Build (Requires Android Studio / SDK)
If you have Android Studio and Android SDK installed on your machine:

1. Generate the native Android project:
   ```bash
   npx expo prebuild -p android
   ```
2. Build the Release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
3. Your generated APK will be located at:
   `mobile/android/app/build/outputs/apk/release/app-release.apk`

