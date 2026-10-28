import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { THEME } from "../lib/theme";
import type { City } from "../lib/cities";

export function Header({
  city,
  onOpenSOS,
  onOpenCityPicker,
}: {
  city: City;
  onOpenSOS: () => void;
  onOpenCityPicker: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Brand */}
        <TouchableOpacity
          style={styles.brandRow}
          onPress={onOpenCityPicker}
          activeOpacity={0.7}
        >
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>✈</Text>
          </View>
          <View style={styles.titleColumn}>
            <View style={styles.cityIndicatorRow}>
              <Text style={styles.brandTitle}>Travel Buddy</Text>
              <Text style={styles.cityDropdownIcon}>▾</Text>
            </View>
            <Text style={styles.citySubtitle} numberOfLines={1}>
              {city.flag} {city.name}, {city.country}
            </Text>
          </View>
        </TouchableOpacity>

        {/* SOS emergency button */}
        <TouchableOpacity
          style={styles.sosButton}
          onPress={onOpenSOS}
          activeOpacity={0.8}
        >
          <Text style={styles.sosEmoji}>🚨</Text>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 10 : 0,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: THEME.radii.md,
    backgroundColor: THEME.colors.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    ...THEME.shadows.brand,
  },
  logoIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  titleColumn: {
    flex: 1,
  },
  cityIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  cityDropdownIcon: {
    fontSize: 14,
    color: THEME.colors.brandPrimary,
    marginLeft: 4,
    fontWeight: "800",
  },
  citySubtitle: {
    fontSize: 11,
    fontWeight: "500",
    color: THEME.colors.inkMuted,
    marginTop: 2,
  },
  sosButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: THEME.radii.full,
    gap: 4,
  },
  sosEmoji: {
    fontSize: 13,
  },
  sosText: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.colors.danger,
    letterSpacing: 0.5,
  },
});
