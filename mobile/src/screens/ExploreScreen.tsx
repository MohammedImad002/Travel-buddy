import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { THEME } from "../lib/theme";
import { PlaceCard } from "../components/PlaceCard";
import { GlassCard } from "../components/GlassCard";
import { useTrip } from "../lib/trip";
import {
  getPlacesForCity,
  getSouvenirsForCity,
  type Souvenir,
} from "../lib/places";

const MOODS = [
  { id: "all", label: "All Sights", icon: "✨" },
  { id: "must-see", label: "Must-see", icon: "🏛️" },
  { id: "outdoors", label: "Outdoors", icon: "🥾" },
  { id: "hidden", label: "Hidden Gems", icon: "💎" },
  { id: "kids", label: "With Kids", icon: "🧒" },
  { id: "evening", label: "Evening", icon: "🌙" },
];

export function ExploreScreen({
  onOpenCityPicker,
}: {
  onOpenCityPicker: () => void;
}) {
  const { destination } = useTrip();
  const [selectedMood, setSelectedMood] = useState("all");

  const places = getPlacesForCity(destination.id, "attractions");
  const souvenirs = getSouvenirsForCity(destination.id);

  const openSouvenirMap = (souvenir: Souvenir) => {
    const q = encodeURIComponent(`${souvenir.buyAt} ${souvenir.area} ${destination.name}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`).catch(() => {});
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🗺️ Explore</Text>
          <Text style={styles.subtitle}>
            Best activities and hidden gems in {destination.name}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cityBtn}
          onPress={onOpenCityPicker}
        >
          <Text style={styles.cityBtnText}>{destination.flag} {destination.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Mood Carousel */}
      <View style={styles.moodCarousel}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodScroll}
        >
          {MOODS.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.moodPill, isSelected && styles.moodPillActive]}
                onPress={() => setSelectedMood(m.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.moodEmoji}>{m.icon}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    isSelected && styles.moodLabelActive,
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Attractions List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Attractions & Landmarks</Text>
      </View>

      {places.map((place, idx) => (
        <PlaceCard
          key={`${place.name}-${idx}`}
          place={place}
          cityName={destination.name}
        />
      ))}

      {/* Souvenirs & Local Shopping Section */}
      <View style={[styles.sectionHeader, { marginTop: 16 }]}>
        <Text style={styles.sectionTitle}>🎁 What to Buy (Authentic Souvenirs)</Text>
        <Text style={styles.sectionSubtitle}>
          Real treasures to take home from {destination.name}
        </Text>
      </View>

      {souvenirs.map((item, idx) => (
        <GlassCard key={idx} style={styles.souvenirCard}>
          <View style={styles.souvenirHeader}>
            <Text style={styles.souvenirItemName}>{item.item}</Text>
            <View
              style={[
                styles.tierBadge,
                item.priceTier === "Budget-friendly"
                  ? styles.tierBudget
                  : item.priceTier === "Mid-range"
                  ? styles.tierMid
                  : styles.tierPremium,
              ]}
            >
              <Text
                style={[
                  styles.tierText,
                  item.priceTier === "Budget-friendly"
                    ? styles.tierBudgetText
                    : item.priceTier === "Mid-range"
                    ? styles.tierMidText
                    : styles.tierPremiumText,
                ]}
              >
                {item.priceTier}
              </Text>
            </View>
          </View>

          <Text style={styles.souvenirWhy}>{item.why}</Text>

          <View style={styles.souvenirFooter}>
            <View style={styles.shopLocationCol}>
              <Text style={styles.buyAtLabel}>Where to buy:</Text>
              <Text style={styles.shopName} numberOfLines={1}>
                🏪 {item.buyAt} ({item.area})
              </Text>
            </View>

            <TouchableOpacity
              style={styles.findShopBtn}
              onPress={() => openSouvenirMap(item)}
            >
              <Text style={styles.findShopText}>Locate ↗</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      ))}

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: THEME.colors.ink,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.colors.inkMuted,
    marginTop: 2,
  },
  cityBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  cityBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  moodCarousel: {
    marginBottom: 14,
  },
  moodScroll: {
    gap: 8,
  },
  moodPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  moodPillActive: {
    backgroundColor: THEME.colors.brandPrimary,
    borderColor: THEME.colors.brandPrimary,
  },
  moodEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.ink,
  },
  moodLabelActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: THEME.colors.ink,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: THEME.colors.inkMuted,
    marginTop: 2,
  },
  souvenirCard: {
    marginBottom: 12,
  },
  souvenirHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  souvenirItemName: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.colors.ink,
    flex: 1,
    marginRight: 8,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.full,
  },
  tierBudget: {
    backgroundColor: "#D1FAE5",
  },
  tierBudgetText: {
    color: "#065F46",
    fontSize: 10,
    fontWeight: "700",
  },
  tierMid: {
    backgroundColor: "#DBEAFE",
  },
  tierMidText: {
    color: "#1E40AF",
    fontSize: 10,
    fontWeight: "700",
  },
  tierPremium: {
    backgroundColor: "#EDE9FE",
  },
  tierPremiumText: {
    color: "#5B21B6",
    fontSize: 10,
    fontWeight: "700",
  },
  tierText: {
    fontSize: 10,
    fontWeight: "700",
  },
  souvenirWhy: {
    fontSize: 12,
    color: THEME.colors.inkMuted,
    lineHeight: 17,
    marginBottom: 10,
  },
  souvenirFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 8,
  },
  shopLocationCol: {
    flex: 1,
    marginRight: 8,
  },
  buyAtLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    color: THEME.colors.inkSubtle,
    letterSpacing: 0.5,
  },
  shopName: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.ink,
    marginTop: 2,
  },
  findShopBtn: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radii.full,
  },
  findShopText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.brandPrimary,
  },
});
