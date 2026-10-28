import React from "react";
import { StyleSheet, View } from "react-native";
import { TripProvider } from "./src/lib/trip";
import { AppNavigator } from "./src/AppNavigator";

let SafeAreaProviderComponent: any = View;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const safeArea = require("react-native-safe-area-context");
  if (safeArea?.SafeAreaProvider) {
    SafeAreaProviderComponent = safeArea.SafeAreaProvider;
  }
} catch {
  // Graceful fallback to View
}

export default function App() {
  return (
    <SafeAreaProviderComponent style={styles.container}>
      <TripProvider>
        <AppNavigator />
      </TripProvider>
    </SafeAreaProviderComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
