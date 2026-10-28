import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import { THEME } from "../lib/theme";
import { GlassCard } from "../components/GlassCard";
import { useTrip, useLocalList } from "../lib/trip";
import { fetchWeather, type WeatherInfo } from "../lib/weather";

type CheckItem = { id: string; text: string; done: boolean };

const DEFAULT_PACKING: CheckItem[] = [
  "Passport & visa",
  "Travel insurance",
  "Phone charger & universal adapter",
  "Essential medicines & first aid",
  "Local cash & backup credit cards",
  "Comfortable walking shoes",
  "Sunscreen & sunglasses",
].map((text, i) => ({ id: `p-${i}`, text, done: false }));

const SAFETY_TIPS = [
  {
    icon: "🎒",
    title: "Pickpocket Awareness",
    advice: "Keep valuables zipped and in front of you in crowded markets, metro stations, and popular sights.",
  },
  {
    icon: "💱",
    title: "Currency Exchange Scams",
    advice: "Always use licensed bank counters or official ATMs. Confirm full fees and count cash before stepping away.",
  },
  {
    icon: "🎟️",
    title: "Tourist Traps & Taxis",
    advice: "Verify menus, prices, and taxi meters before accepting rides or ordering. Decline unsolicited guides.",
  },
  {
    icon: "⚠️",
    title: "Distraction Tactics",
    advice: "Be vigilant if someone spills something or creates sudden chaos around you — it is a classic distraction routine.",
  },
];

export function EssentialsScreen({
  onOpenCityPicker,
}: {
  onOpenCityPicker: () => void;
}) {
  const { destination } = useTrip();
  const { items: packingList, save: savePacking } = useLocalList<CheckItem>(
    "tb-packing-list",
    DEFAULT_PACKING
  );
  const { items: itineraryList, save: saveItinerary } = useLocalList<CheckItem>(
    "tb-itinerary-list",
    []
  );

  const [newPackInput, setNewPackInput] = useState("");
  const [newPlanInput, setNewPlanInput] = useState("");
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    fetchWeather(destination.lat, destination.lon).then((res) => setWeather(res));
  }, [destination.lat, destination.lon]);

  const togglePacking = (id: string) => {
    savePacking(
      packingList.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const addPackingItem = () => {
    if (!newPackInput.trim()) return;
    savePacking([
      ...packingList,
      { id: `custom-${Date.now()}`, text: newPackInput.trim(), done: false },
    ]);
    setNewPackInput("");
  };

  const deletePackingItem = (id: string) => {
    savePacking(packingList.filter((item) => item.id !== id));
  };

  const toggleItinerary = (id: string) => {
    saveItinerary(
      itineraryList.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const addItineraryItem = () => {
    if (!newPlanInput.trim()) return;
    saveItinerary([
      ...itineraryList,
      { id: `itin-${Date.now()}`, text: newPlanInput.trim(), done: false },
    ]);
    setNewPlanInput("");
  };

  const deleteItineraryItem = (id: string) => {
    saveItinerary(itineraryList.filter((item) => item.id !== id));
  };

  const handleCallEmergency = () => {
    Linking.openURL(`tel:${destination.emergency}`).catch(() => {});
  };

  const packedCount = packingList.filter((i) => i.done).length;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🧳 Travel Essentials</Text>
          <Text style={styles.subtitle}>
            Packing, itinerary, weather & safety for {destination.name}
          </Text>
        </View>

        <TouchableOpacity style={styles.cityBtn} onPress={onOpenCityPicker}>
          <Text style={styles.cityBtnText}>{destination.flag} {destination.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Assistance Banner */}
      <View style={styles.emergencyBanner}>
        <View style={styles.emergencyLeft}>
          <Text style={styles.emergencyBadge}>EMERGENCY HOTLINE</Text>
          <Text style={styles.emergencyCity}>
            {destination.name}, {destination.country}
          </Text>
          <Text style={styles.emergencyNumberText}>Dial: {destination.emergency}</Text>
        </View>

        <TouchableOpacity style={styles.callNowBtn} onPress={handleCallEmergency}>
          <Text style={styles.callNowText}>Call 📞</Text>
        </TouchableOpacity>
      </View>

      {/* 3-Day Weather Forecast */}
      {weather && weather.daily.length > 0 && (
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.cardSectionTitle}>🌤️ 3-Day Weather Forecast</Text>
          <View style={styles.forecastRow}>
            {weather.daily.map((day, idx) => (
              <View key={idx} style={styles.forecastItem}>
                <Text style={styles.forecastDay}>{day.day}</Text>
                <Text style={styles.forecastEmoji}>{day.emoji}</Text>
                <Text style={styles.forecastTemp}>
                  {day.high}° / {day.low}°
                </Text>
                <Text style={styles.forecastSummary} numberOfLines={1}>
                  {day.summary}
                </Text>
              </View>
            ))}
          </View>
        </GlassCard>
      )}

      {/* Interactive Packing Checklist */}
      <GlassCard style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.cardSectionTitle}>🎒 Packing Checklist</Text>
            <Text style={styles.cardSectionSub}>
              {packedCount} of {packingList.length} packed
            </Text>
          </View>

          <View style={styles.progressPill}>
            <Text style={styles.progressPillText}>
              {packingList.length > 0
                ? `${Math.round((packedCount / packingList.length) * 100)}%`
                : "0%"}
            </Text>
          </View>
        </View>

        {/* Add packing item input */}
        <View style={styles.addItemRow}>
          <TextInput
            style={styles.addInput}
            placeholder="Add new item to pack…"
            placeholderTextColor={THEME.colors.inkSubtle}
            value={newPackInput}
            onChangeText={setNewPackInput}
            onSubmitEditing={addPackingItem}
          />
          <TouchableOpacity
            style={styles.addBtn}
            onPress={addPackingItem}
            disabled={!newPackInput.trim()}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Checklist items */}
        <View style={styles.itemsList}>
          {packingList.map((item) => (
            <View key={item.id} style={styles.checkRow}>
              <TouchableOpacity
                style={styles.checkboxTouchable}
                onPress={() => togglePacking(item.id)}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    item.done && styles.checkboxBoxDone,
                  ]}
                >
                  {item.done && <Text style={styles.checkboxCheck}>✓</Text>}
                </View>
                <Text
                  style={[
                    styles.checkText,
                    item.done && styles.checkTextDone,
                  ]}
                  numberOfLines={2}
                >
                  {item.text}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deletePackingItem(item.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Day-by-Day Itinerary Planner */}
      <GlassCard style={styles.sectionCard}>
        <Text style={styles.cardSectionTitle}>🗓️ Itinerary Planner</Text>
        <Text style={styles.cardSectionSub}>
          Plan your activities and milestones for {destination.name}
        </Text>

        <View style={styles.addItemRow}>
          <TextInput
            style={styles.addInput}
            placeholder="e.g. 10:00 AM — Red Fort tour"
            placeholderTextColor={THEME.colors.inkSubtle}
            value={newPlanInput}
            onChangeText={setNewPlanInput}
            onSubmitEditing={addItineraryItem}
          />
          <TouchableOpacity
            style={styles.addBtn}
            onPress={addItineraryItem}
            disabled={!newPlanInput.trim()}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {itineraryList.length === 0 ? (
          <Text style={styles.emptyNote}>
            No itinerary items added yet. Tap above to plan your day!
          </Text>
        ) : (
          <View style={styles.itemsList}>
            {itineraryList.map((item) => (
              <View key={item.id} style={styles.checkRow}>
                <TouchableOpacity
                  style={styles.checkboxTouchable}
                  onPress={() => toggleItinerary(item.id)}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      item.done && styles.checkboxBoxDone,
                    ]}
                  >
                    {item.done && <Text style={styles.checkboxCheck}>✓</Text>}
                  </View>
                  <Text
                    style={[
                      styles.checkText,
                      item.done && styles.checkTextDone,
                    ]}
                    numberOfLines={2}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => deleteItineraryItem(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </GlassCard>

      {/* Safety & Scam Awareness Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🛡️ Travel Safety & Scam Awareness</Text>
        <Text style={styles.sectionSubtitle}>
          Expert tips to keep your trip safe and hassle-free
        </Text>
      </View>

      <View style={styles.safetyList}>
        {SAFETY_TIPS.map((tip, idx) => (
          <GlassCard key={idx} style={styles.safetyCard}>
            <View style={styles.safetyHeader}>
              <Text style={styles.safetyIcon}>{tip.icon}</Text>
              <Text style={styles.safetyTitle}>{tip.title}</Text>
            </View>
            <Text style={styles.safetyAdvice}>{tip.advice}</Text>
          </GlassCard>
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
  emergencyBanner: {
    backgroundColor: "#FEE2E2",
    borderRadius: THEME.radii.xl,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 16,
  },
  emergencyLeft: {
    flex: 1,
    marginRight: 12,
  },
  emergencyBadge: {
    fontSize: 9,
    fontWeight: "800",
    color: THEME.colors.danger,
    letterSpacing: 1,
    marginBottom: 3,
  },
  emergencyCity: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  emergencyNumberText: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.danger,
    marginTop: 2,
  },
  callNowBtn: {
    backgroundColor: THEME.colors.danger,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: THEME.radii.full,
  },
  callNowText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionCard: {
    marginBottom: 16,
  },
  cardSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.ink,
  },
  cardSectionSub: {
    fontSize: 11,
    color: THEME.colors.inkMuted,
    marginTop: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressPill: {
    backgroundColor: "#EDE9FE",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: THEME.radii.full,
  },
  progressPillText: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.colors.brandPrimary,
  },
  forecastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 8,
  },
  forecastItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: THEME.radii.md,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  forecastDay: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  forecastEmoji: {
    fontSize: 22,
    marginVertical: 4,
  },
  forecastTemp: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  forecastSummary: {
    fontSize: 9,
    color: THEME.colors.inkMuted,
    marginTop: 2,
  },
  addItemRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 12,
  },
  addInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: THEME.radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: THEME.colors.ink,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  addBtn: {
    backgroundColor: THEME.colors.brandPrimary,
    paddingHorizontal: 14,
    borderRadius: THEME.radii.md,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  itemsList: {
    gap: 8,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  checkboxTouchable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxBoxDone: {
    backgroundColor: THEME.colors.brandPrimary,
    borderColor: THEME.colors.brandPrimary,
  },
  checkboxCheck: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  checkText: {
    fontSize: 13,
    color: THEME.colors.ink,
    flex: 1,
  },
  checkTextDone: {
    color: THEME.colors.inkSubtle,
    textDecorationLine: "line-through",
  },
  deleteBtn: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 12,
    color: THEME.colors.inkSubtle,
  },
  emptyNote: {
    fontSize: 12,
    color: THEME.colors.inkMuted,
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 12,
  },
  sectionHeader: {
    marginTop: 6,
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
  safetyList: {
    gap: 10,
  },
  safetyCard: {
    marginBottom: 4,
  },
  safetyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  safetyIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  safetyAdvice: {
    fontSize: 12,
    color: THEME.colors.inkMuted,
    lineHeight: 18,
  },
});
