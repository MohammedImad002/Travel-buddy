import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { THEME } from "../lib/theme";

export type TabId = "home" | "nearby" | "assistant" | "explore" | "essentials";

const TABS: Array<{ id: TabId; label: string; icon: string; center?: boolean }> = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "nearby", label: "Nearby", icon: "📍" },
  { id: "assistant", label: "Ask AI", icon: "✦", center: true },
  { id: "explore", label: "Explore", icon: "🗺️" },
  { id: "essentials", label: "Essentials", icon: "🧳" },
];

export function BottomTabBar({
  activeTab,
  onSelectTab,
}: {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          if (tab.center) {
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.centerButtonWrapper}
                onPress={() => onSelectTab(tab.id)}
                activeOpacity={0.85}
              >
                <View style={styles.centerButton}>
                  <Text style={styles.centerIcon}>{tab.icon}</Text>
                </View>
                <Text style={[styles.tabLabel, styles.centerLabel]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          }

          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    minWidth: 54,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: THEME.colors.inkMuted,
  },
  tabLabelActive: {
    color: THEME.colors.brandPrimary,
    fontWeight: "700",
  },
  centerButtonWrapper: {
    alignItems: "center",
    marginTop: -24,
  },
  centerButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: THEME.colors.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: THEME.colors.cream,
    ...THEME.shadows.fab,
  },
  centerIcon: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  centerLabel: {
    marginTop: 2,
    color: THEME.colors.brandPrimary,
    fontWeight: "700",
  },
});
