import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { THEME } from "../lib/theme";
import { CITIES, findNearestCity, type City } from "../lib/cities";

let LocationModule: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LocationModule = require("expo-location");
} catch {
  // Expo location optional
}

export function CityPickerModal({
  visible,
  onClose,
  selectedCity,
  onSelectCity,
  title = "Select City",
}: {
  visible: boolean;
  onClose: () => void;
  selectedCity: City;
  onSelectCity: (city: City) => void;
  title?: string;
}) {
  const [search, setSearch] = useState("");
  const [locating, setLocating] = useState(false);

  const filtered = CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleGPSDetect = async () => {
    setLocating(true);
    try {
      if (LocationModule) {
        const { status } = await LocationModule.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await LocationModule.getCurrentPositionAsync({});
          const nearest = findNearestCity(loc.coords.latitude, loc.coords.longitude);
          onSelectCity(nearest);
          onClose();
          return;
        }
      }
    } catch {
      // Fallback
    } finally {
      setLocating(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.dragIndicator} />

          <View style={styles.headerRow}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* GPS Auto-detect button */}
          <TouchableOpacity
            style={styles.gpsButton}
            onPress={handleGPSDetect}
            disabled={locating}
          >
            <Text style={styles.gpsIcon}>📍</Text>
            <Text style={styles.gpsText}>
              {locating ? "Finding your nearest city..." : "Use Current Location (GPS)"}
            </Text>
          </TouchableOpacity>

          {/* Search bar */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search city or country..."
              placeholderTextColor={THEME.colors.inkSubtle}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Cities List */}
          <ScrollView style={styles.cityList} showsVerticalScrollIndicator={false}>
            {filtered.map((city) => {
              const isSelected = city.id === selectedCity.id;
              return (
                <TouchableOpacity
                  key={city.id}
                  style={[styles.cityItem, isSelected && styles.cityItemSelected]}
                  onPress={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                >
                  <Text style={styles.flagEmoji}>{city.flag}</Text>
                  <View style={styles.cityMeta}>
                    <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>
                      {city.name}
                    </Text>
                    <Text style={styles.countryName}>
                      {city.country} • {city.currency} • {city.language}
                    </Text>
                  </View>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: THEME.radii.xl,
    borderTopRightRadius: THEME.radii.xl,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: "82%",
    ...THEME.shadows.card,
  },
  dragIndicator: {
    width: 36,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  closeBtn: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME.colors.inkMuted,
    padding: 4,
  },
  gpsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F0FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: THEME.radii.md,
    marginBottom: 12,
  },
  gpsIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  gpsText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.brandPrimary,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: THEME.radii.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
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
  cityList: {
    marginTop: 4,
  },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: THEME.radii.md,
    marginBottom: 6,
  },
  cityItemSelected: {
    backgroundColor: "#F5F3FF",
  },
  flagEmoji: {
    fontSize: 26,
    marginRight: 14,
  },
  cityMeta: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME.colors.ink,
  },
  cityNameSelected: {
    color: THEME.colors.brandPrimary,
    fontWeight: "700",
  },
  countryName: {
    fontSize: 12,
    color: THEME.colors.inkMuted,
    marginTop: 2,
  },
  checkMark: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.colors.brandPrimary,
    marginLeft: 8,
  },
});
