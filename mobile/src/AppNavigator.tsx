import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { THEME } from "./lib/theme";
import { useTrip } from "./lib/trip";
import { Header } from "./components/Header";
import { BottomTabBar, type TabId } from "./components/BottomTabBar";
import { CityPickerModal } from "./components/CityPickerModal";
import { SOSModal } from "./components/SOSModal";

// Screens
import { HomeScreen } from "./screens/HomeScreen";
import { NearbyScreen } from "./screens/NearbyScreen";
import { AssistantScreen } from "./screens/AssistantScreen";
import { ExploreScreen } from "./screens/ExploreScreen";
import { EssentialsScreen } from "./screens/EssentialsScreen";
import { FoodScreen } from "./screens/FoodScreen";
import { TranslatorScreen } from "./screens/TranslatorScreen";
import { CurrencyScreen } from "./screens/CurrencyScreen";
import { ClockScreen } from "./screens/ClockScreen";

export function AppNavigator() {
  const { destination, setDestination } = useTrip();

  // Active navigation state
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [subRoute, setSubRoute] = useState<string | null>(null);

  // Modals
  const [cityPickerVisible, setCityPickerVisible] = useState(false);
  const [sosVisible, setSosVisible] = useState(false);

  const handleNavigate = (route: string) => {
    if (
      route === "home" ||
      route === "nearby" ||
      route === "assistant" ||
      route === "explore" ||
      route === "essentials"
    ) {
      setSubRoute(null);
      setActiveTab(route as TabId);
    } else {
      setSubRoute(route);
    }
  };

  const handleTabSelect = (tab: TabId) => {
    setSubRoute(null);
    setActiveTab(tab);
  };

  const handleBackToMain = () => {
    setSubRoute(null);
  };

  // Render current screen content
  const renderContent = () => {
    if (subRoute === "food") {
      return (
        <FoodScreen
          onBack={handleBackToMain}
          onOpenCityPicker={() => setCityPickerVisible(true)}
        />
      );
    }
    if (subRoute === "translator") {
      return (
        <TranslatorScreen
          onBack={handleBackToMain}
          onOpenCityPicker={() => setCityPickerVisible(true)}
        />
      );
    }
    if (subRoute === "currency") {
      return (
        <CurrencyScreen
          onBack={handleBackToMain}
          onOpenCityPicker={() => setCityPickerVisible(true)}
        />
      );
    }
    if (subRoute === "clock") {
      return (
        <ClockScreen
          onBack={handleBackToMain}
          onOpenCityPicker={() => setCityPickerVisible(true)}
        />
      );
    }

    switch (activeTab) {
      case "nearby":
        return (
          <NearbyScreen
            onOpenCityPicker={() => setCityPickerVisible(true)}
          />
        );
      case "assistant":
        return (
          <AssistantScreen
            onOpenCityPicker={() => setCityPickerVisible(true)}
          />
        );
      case "explore":
        return (
          <ExploreScreen
            onOpenCityPicker={() => setCityPickerVisible(true)}
          />
        );
      case "essentials":
        return (
          <EssentialsScreen
            onOpenCityPicker={() => setCityPickerVisible(true)}
          />
        );
      case "home":
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Persistent App Header (when not in subscreen with custom back) */}
      {!subRoute && (
        <Header
          city={destination}
          onOpenSOS={() => setSosVisible(true)}
          onOpenCityPicker={() => setCityPickerVisible(true)}
        />
      )}

      {/* Screen View */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Persistent Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onSelectTab={handleTabSelect} />

      {/* City Switcher Modal */}
      <CityPickerModal
        visible={cityPickerVisible}
        onClose={() => setCityPickerVisible(false)}
        selectedCity={destination}
        onSelectCity={(c) => setDestination(c)}
        title="Select Travel Destination"
      />

      {/* SOS Emergency Call Modal */}
      <SOSModal
        visible={sosVisible}
        onClose={() => setSosVisible(false)}
        city={destination}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.cream,
  },
  content: {
    flex: 1,
  },
});
