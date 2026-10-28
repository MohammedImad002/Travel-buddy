import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { THEME } from "../lib/theme";
import type { Place } from "../lib/places";

export function PlaceCard({ place, cityName }: { place: Place; cityName?: string }) {
  const handleOpenMap = () => {
    const q = encodeURIComponent(`${place.name} ${place.area} ${cityName ?? ""}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`).catch(() => {});
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {place.name}
          </Text>
          <Text style={styles.area} numberOfLines={1}>
            📍 {place.area}
          </Text>
        </View>

        <View style={styles.ratingBadge}>
          <Text style={styles.starIcon}>★</Text>
          <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {place.description}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.metaPills}>
          <View style={styles.pricePill}>
            <Text style={styles.priceText}>{place.priceLevel}</Text>
          </View>
          <View style={styles.openPill}>
            <Text style={styles.openText}>🕒 {place.openHint}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.mapButton}
          onPress={handleOpenMap}
          activeOpacity={0.7}
        >
          <Text style={styles.mapButtonText}>Maps ↗</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radii.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    ...THEME.shadows.sm,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  headerInfo: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  area: {
    fontSize: 12,
    color: THEME.colors.inkMuted,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radii.full,
    gap: 3,
  },
  starIcon: {
    fontSize: 12,
    color: "#D97706",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  description: {
    fontSize: 13,
    color: THEME.colors.inkMuted,
    lineHeight: 18,
    marginVertical: 6,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  metaPills: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    flex: 1,
  },
  pricePill: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.sm,
  },
  priceText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  openPill: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.sm,
  },
  openText: {
    fontSize: 11,
    color: "#1D4ED8",
    fontWeight: "500",
  },
  mapButton: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radii.full,
  },
  mapButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.brandPrimary,
  },
});
