import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { THEME } from "../lib/theme";
import { GlassCard } from "../components/GlassCard";
import { useTrip } from "../lib/trip";
import {
  CITIES,
  dayIn,
  offsetHours,
  timeIn,
  type City,
} from "../lib/cities";

export function ClockScreen({
  onBack,
  onOpenCityPicker,
}: {
  onBack?: () => void;
  onOpenCityPicker: () => void;
}) {
  const { home, destination, setHome, setDestination } = useTrip();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const homeOffset = offsetHours(home.timeZone, now);
  const destOffset = offsetHours(destination.timeZone, now);
  const diffHours = Math.round((destOffset - homeOffset) * 10) / 10;

  const otherCities = CITIES.filter(
    (c) => c.id !== home.id && c.id !== destination.id
  ).slice(0, 8);

  const formatOffsetDiff = (diff: number) => {
    if (diff === 0) return "Same time as home";
    if (diff > 0) return `+${diff} hrs ahead of home`;
    return `${diff} hrs behind home`;
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.title}>🕐 World Clock</Text>
            <Text style={styles.subtitle}>
              Your home time vs. your destination
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.cityBtn} onPress={onOpenCityPicker}>
          <Text style={styles.cityBtnText}>{destination.flag} {destination.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Dual Comparison Card */}
      <GlassCard style={styles.dualCard}>
        <View style={styles.dualRow}>
          {/* HOME */}
          <View style={styles.homeCard}>
            <Text style={styles.dualLabel}>HOME</Text>
            <Text style={styles.dualCityName} numberOfLines={1}>
              {home.flag} {home.name}
            </Text>
            <Text style={styles.dualClockDigits}>
              {timeIn(home.timeZone, now)}
            </Text>
            <Text style={styles.dualDate}>{dayIn(home.timeZone, now)}</Text>
          </View>

          {/* DESTINATION */}
          <View style={styles.destCard}>
            <Text style={[styles.dualLabel, styles.destLabel]}>DESTINATION</Text>
            <Text style={[styles.dualCityName, styles.destCityName]} numberOfLines={1}>
              {destination.flag} {destination.name}
            </Text>
            <Text style={[styles.dualClockDigits, styles.destClockDigits]}>
              {timeIn(destination.timeZone, now)}
            </Text>
            <Text style={[styles.dualDate, styles.destDate]}>
              {dayIn(destination.timeZone, now)}
            </Text>
          </View>
        </View>

        {/* Difference Badge */}
        <View style={styles.diffBadge}>
          <Text style={styles.diffText}>
            ⏱️ {destination.name} is {formatOffsetDiff(diffHours)}
          </Text>
        </View>
      </GlassCard>

      {/* Other Major Global Cities */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Major World Cities</Text>
        <Text style={styles.sectionSubtitle}>
          Real-time clocks across international hubs
        </Text>
      </View>

      <View style={styles.cityGrid}>
        {otherCities.map((city) => (
          <View key={city.id} style={styles.cityCard}>
            <View style={styles.cityTop}>
              <Text style={styles.cityCardFlag}>{city.flag}</Text>
              <Text style={styles.cityCardTime}>
                {timeIn(city.timeZone, now)}
              </Text>
            </View>
            <Text style={styles.cityCardName} numberOfLines={1}>
              {city.name}
            </Text>
            <Text style={styles.cityCardCountry} numberOfLines={1}>
              {city.country} • {dayIn(city.timeZone, now)}
            </Text>
          </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backBtn: {
    padding: 4,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  title: {
    fontSize: 20,
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
  dualCard: {
    marginBottom: 20,
    padding: 14,
  },
  dualRow: {
    flexDirection: "row",
    gap: 10,
  },
  homeCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: THEME.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  destCard: {
    flex: 1,
    backgroundColor: THEME.colors.brandPrimary,
    borderRadius: THEME.radii.lg,
    padding: 14,
    ...THEME.shadows.brand,
  },
  dualLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: THEME.colors.inkMuted,
    letterSpacing: 1,
  },
  destLabel: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  dualCityName: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.ink,
    marginTop: 3,
  },
  destCityName: {
    color: "#FFFFFF",
  },
  dualClockDigits: {
    fontSize: 28,
    fontWeight: "800",
    color: THEME.colors.ink,
    marginVertical: 4,
  },
  destClockDigits: {
    color: "#FFFFFF",
  },
  dualDate: {
    fontSize: 11,
    color: THEME.colors.inkMuted,
  },
  destDate: {
    color: "rgba(255, 255, 255, 0.85)",
  },
  diffBadge: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: THEME.radii.full,
    alignSelf: "center",
    marginTop: 14,
  },
  diffText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  sectionHeader: {
    marginBottom: 12,
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
  cityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  cityCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    ...THEME.shadows.sm,
  },
  cityTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cityCardFlag: {
    fontSize: 20,
  },
  cityCardTime: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.colors.brandPrimary,
  },
  cityCardName: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  cityCardCountry: {
    fontSize: 11,
    color: THEME.colors.inkMuted,
    marginTop: 2,
  },
});
