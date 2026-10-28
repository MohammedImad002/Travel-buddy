import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { THEME } from "../lib/theme";
import { PlaceCard } from "../components/PlaceCard";
import { useTrip } from "../lib/trip";
import { getPlacesForCity, type Place } from "../lib/places";

const CATEGORIES = [
  { id: "all", label: "All Spots", icon: "🌟" },
  { id: "restaurants", label: "Restaurants", icon: "🍽️" },
  { id: "hotels", label: "Hotels", icon: "🏨" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "cafés", label: "Cafés", icon: "☕" },
  { id: "hospitals", label: "Hospitals", icon: "🏥" },
  { id: "pharmacies", label: "Pharmacies", icon: "💊" },
  { id: "attractions", label: "Attractions", icon: "🏛️" },
  { id: "mosques", label: "Mosques", icon: "🕌" },
  { id: "temples", label: "Temples", icon: "🛕" },
  { id: "ev", label: "EV Charge", icon: "🔌" },
];

export function NearbyScreen({
  onOpenCityPicker,
}: {
  onOpenCityPicker: () => void;
}) {
  const { destination } = useTrip();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const places = getPlacesForCity(destination.id, selectedCategory);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📍 Nearby Places</Text>
          <Text style={styles.subtitle}>
            Essential spots around {destination.name}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.switchCityBtn}
          onPress={onOpenCityPicker}
        >
          <Text style={styles.switchCityText}>
            {destination.flag} Change
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Category Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.catEmoji}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.catLabel,
                    isSelected && styles.catLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Places ScrollView */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.countText}>
          Showing {places.length} places in {destination.name}
        </Text>

        {places.map((place, idx) => (
          <PlaceCard
            key={`${place.name}-${idx}`}
            place={place}
            cityName={destination.name}
          />
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.colors.cream,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
  switchCityBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  switchCityText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  carouselContainer: {
    paddingVertical: 10,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  categoryPillActive: {
    backgroundColor: THEME.colors.brandPrimary,
    borderColor: THEME.colors.brandPrimary,
  },
  catEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: THEME.colors.ink,
  },
  catLabelActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  countText: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.colors.inkMuted,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
