import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { THEME } from "../lib/theme";
import { GlassCard } from "../components/GlassCard";
import { useTrip } from "../lib/trip";
import { dayIn, timeIn } from "../lib/cities";
import { fetchWeather, type WeatherInfo } from "../lib/weather";

type ToolItem = {
  id: string;
  label: string;
  icon: string;
  tint: string;
  action: () => void;
};

const TRAVEL_CREATORS = [
  { name: "Muslim Travel Girl", focus: "Muslim travel", query: "Muslim Travel Girl" },
  { name: "Have Halal, Will Travel", focus: "Muslim-friendly guides", query: "Have Halal Will Travel" },
  { name: "Kara and Nate", focus: "Travel stories", query: "Kara and Nate" },
  { name: "Drew Binsky", focus: "Local culture", query: "Drew Binsky" },
];

export function HomeScreen({
  onNavigate,
}: {
  onNavigate: (route: string) => void;
}) {
  const { current, destination, setDestination, setCity } = useTrip();
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Live weather
  useEffect(() => {
    let active = true;
    setLoadingWeather(true);
    fetchWeather(destination.lat, destination.lon).then((data) => {
      if (active) {
        setWeather(data);
        setLoadingWeather(false);
      }
    });
    return () => {
      active = false;
    };
  }, [destination.lat, destination.lon]);

  const TOOLS: ToolItem[] = [
    {
      id: "translator",
      label: "Translator",
      icon: "🌐",
      tint: THEME.colors.tintLilac,
      action: () => onNavigate("translator"),
    },
    {
      id: "currency",
      label: "Currency",
      icon: "💱",
      tint: THEME.colors.tintBrand,
      action: () => onNavigate("currency"),
    },
    {
      id: "clock",
      label: "World Clock",
      icon: "🕐",
      tint: THEME.colors.tintGold,
      action: () => onNavigate("clock"),
    },
    {
      id: "nearby",
      label: "Nearby",
      icon: "📍",
      tint: THEME.colors.tintCoral,
      action: () => onNavigate("nearby"),
    },
    {
      id: "food",
      label: "Food Finder",
      icon: "🍴",
      tint: THEME.colors.tintMint,
      action: () => onNavigate("food"),
    },
    {
      id: "explore",
      label: "Explore",
      icon: "🗺️",
      tint: THEME.colors.tintSky,
      action: () => onNavigate("explore"),
    },
    {
      id: "assistant",
      label: "Ask AI",
      icon: "🤖",
      tint: THEME.colors.tintRose,
      action: () => onNavigate("assistant"),
    },
    {
      id: "essentials",
      label: "Essentials",
      icon: "🧳",
      tint: THEME.colors.tintBrand,
      action: () => onNavigate("essentials"),
    },
  ];

  const openCreator = (query: string) => {
    const term = encodeURIComponent(`${query} ${destination.name}`);
    Linking.openURL(`https://www.youtube.com/results?search_query=${term}`).catch(() => {});
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Destination Hero Card */}
      <GlassCard style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.heroTextCol}>
            <Text style={styles.tag}>YOU'RE IN</Text>
            <Text style={styles.cityName} numberOfLines={1}>
              {destination.flag} {destination.name}
            </Text>
            <Text style={styles.dateText}>{dayIn(destination.timeZone, time)}</Text>
          </View>

          <View style={styles.heroTimeCol}>
            <Text style={styles.clockDigits}>{timeIn(destination.timeZone, time)}</Text>
            <Text style={styles.localTimeLabel}>Local time</Text>
          </View>
        </View>

        {/* Weather Bar */}
        <View style={styles.weatherBar}>
          <Text style={styles.weatherIcon}>
            {weather ? weather.emoji : "🌤️"}
          </Text>
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherTitle} numberOfLines={1}>
              {weather
                ? `${weather.temp}°C • ${weather.summary}`
                : loadingWeather
                ? "Loading weather…"
                : "Weather info"}
            </Text>
            <Text style={styles.weatherSub}>
              {weather
                ? `H: ${weather.high}° • L: ${weather.low}° • Wind: ${weather.wind} km/h`
                : "Live Open-Meteo forecast"}
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* Quick Tools Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Travel Toolkit</Text>
        <Text style={styles.sectionSubtitle}>Everything you need on the move</Text>
      </View>

      {/* Tools Grid (2 columns) */}
      <View style={styles.toolGrid}>
        {TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.toolCard, { backgroundColor: tool.tint }]}
            onPress={tool.action}
            activeOpacity={0.75}
          >
            <View style={styles.toolIconContainer}>
              <Text style={styles.toolEmoji}>{tool.icon}</Text>
            </View>
            <Text style={styles.toolLabel}>{tool.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Destination Description Card */}
      <GlassCard style={styles.descCard}>
        <Text style={styles.descTitle}>About {destination.name}</Text>
        <Text style={styles.descBody}>{destination.description}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>💱 {destination.currency}</Text>
          </View>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>🗣️ {destination.language}</Text>
          </View>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>🚨 SOS: {destination.emergency}</Text>
          </View>
        </View>
      </GlassCard>

      {/* Curated by Travelers */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Curated by Travelers</Text>
        <Text style={styles.sectionSubtitle}>
          Watch top guides and stories for {destination.name}
        </Text>
      </View>

      <View style={styles.creatorList}>
        {TRAVEL_CREATORS.map((creator) => (
          <TouchableOpacity
            key={creator.name}
            style={styles.creatorCard}
            onPress={() => openCreator(creator.query)}
            activeOpacity={0.7}
          >
            <View style={styles.creatorAvatar}>
              <Text style={styles.creatorEmoji}>▶</Text>
            </View>
            <View style={styles.creatorTextCol}>
              <Text style={styles.creatorName}>{creator.name}</Text>
              <Text style={styles.creatorFocus}>{creator.focus}</Text>
            </View>
            <Text style={styles.openExternal}>Watch ↗</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.colors.cream,
  },
  container: {
    padding: 16,
  },
  heroCard: {
    marginBottom: 20,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroTextCol: {
    flex: 1,
    marginRight: 10,
  },
  tag: {
    fontSize: 10,
    fontWeight: "800",
    color: THEME.colors.brandPrimary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  cityName: {
    fontSize: 24,
    fontWeight: "800",
    color: THEME.colors.ink,
    lineHeight: 28,
  },
  dateText: {
    fontSize: 12,
    color: THEME.colors.inkMuted,
    marginTop: 3,
  },
  heroTimeCol: {
    alignItems: "flex-end",
  },
  clockDigits: {
    fontSize: 26,
    fontWeight: "800",
    color: THEME.colors.ink,
  },
  localTimeLabel: {
    fontSize: 10,
    color: THEME.colors.inkMuted,
    marginTop: 2,
  },
  weatherBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: THEME.radii.lg,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  weatherIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  weatherSub: {
    fontSize: 11,
    color: THEME.colors.inkMuted,
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.ink,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: THEME.colors.inkMuted,
    marginTop: 2,
  },
  toolGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    rowGap: 12,
  },
  toolCard: {
    width: "48%",
    borderRadius: THEME.radii.lg,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    ...THEME.shadows.sm,
  },
  toolIconContainer: {
    width: 38,
    height: 38,
    borderRadius: THEME.radii.md,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  toolEmoji: {
    fontSize: 18,
  },
  toolLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.colors.ink,
    flex: 1,
  },
  descCard: {
    marginBottom: 20,
  },
  descTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.colors.ink,
    marginBottom: 6,
  },
  descBody: {
    fontSize: 13,
    color: THEME.colors.inkMuted,
    lineHeight: 19,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  infoBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  infoBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.colors.ink,
  },
  creatorList: {
    gap: 8,
  },
  creatorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radii.md,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    ...THEME.shadows.sm,
  },
  creatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  creatorEmoji: {
    fontSize: 12,
    color: "#EF4444",
  },
  creatorTextCol: {
    flex: 1,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.ink,
  },
  creatorFocus: {
    fontSize: 11,
    color: THEME.colors.inkMuted,
    marginTop: 1,
  },
  openExternal: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.brandPrimary,
    marginLeft: 8,
  },
});
