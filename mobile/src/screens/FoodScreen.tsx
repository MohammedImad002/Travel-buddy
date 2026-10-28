import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { THEME } from "../lib/theme";
import { PlaceCard } from "../components/PlaceCard";
import { useTrip } from "../lib/trip";
import { getPlacesForCity, type Place } from "../lib/places";

const CUISINES = [
  "All Cuisines",
  "Halal",
  "Indian",
  "Vegetarian",
  "Vegan",
  "Local street food",
  "Seafood",
  "Cafés",
  "Desserts",
];

export function FoodScreen({
  onBack,
  onOpenCityPicker,
}: {
  onBack?: () => void;
  onOpenCityPicker: () => void;
}) {
  const { destination } = useTrip();
  const [selectedCuisine, setSelectedCuisine] = useState("All Cuisines");
  const [query, setQuery] = useState("");

  const allPlaces = getPlacesForCity(destination.id, "restaurants").concat(
    getPlacesForCity(destination.id, "cafés")
  );

  const filtered = allPlaces.filter((p) => {
    const matchesCuisine =
      selectedCuisine === "All Cuisines" ||
      p.description.toLowerCase().includes(selectedCuisine.toLowerCase()) ||
      p.category.toLowerCase().includes(selectedCuisine.toLowerCase()) ||
      p.name.toLowerCase().includes(selectedCuisine.toLowerCase());

    const matchesQuery =
      !query.trim() ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.area.toLowerCase().includes(query.toLowerCase());

    return matchesCuisine && matchesQuery;
  });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.title}>🍴 Food Finder</Text>
            <Text style={styles.subtitle}>
              Eat well in {destination.name}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.cityBtn}
          onPress={onOpenCityPicker}
        >
          <Text style={styles.cityBtnText}>{destination.flag} {destination.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Anything specific? e.g. biryani, budget, late night"
            placeholderTextColor={THEME.colors.inkSubtle}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Horizontal Cuisine Chips */}
      <View style={styles.cuisineCarousel}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cuisineScroll}
        >
          {CUISINES.map((c) => {
            const isSelected = selectedCuisine === c;
            return (
              <TouchableOpacity
                key={c}
                style={[styles.cuisineChip, isSelected && styles.cuisineChipActive]}
                onPress={() => setSelectedCuisine(c)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.cuisineChipText,
                    isSelected && styles.cuisineChipTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Places Results */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultsCount}>
          {filtered.length} culinary spots found
        </Text>

        {filtered.map((place, idx) => (
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    padding: 6,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: "700",
    color: THEME.colors.ink,
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
  searchWrapper: {
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: THEME.radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: THEME.colors.ink,
    padding: 0,
  },
  clearIcon: {
    fontSize: 13,
    color: THEME.colors.inkMuted,
    padding: 4,
  },
  cuisineCarousel: {
    paddingVertical: 6,
  },
  cuisineScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  cuisineChip: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  cuisineChipActive: {
    backgroundColor: THEME.colors.brandPrimary,
    borderColor: THEME.colors.brandPrimary,
  },
  cuisineChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.ink,
  },
  cuisineChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  resultsCount: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.colors.inkMuted,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
