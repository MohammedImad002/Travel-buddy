import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Pressable,
} from "react-native";
import { THEME } from "../lib/theme";
import type { City } from "../lib/cities";

export function SOSModal({
  visible,
  onClose,
  city,
}: {
  visible: boolean;
  onClose: () => void;
  city: City;
}) {
  const handleCall = () => {
    onClose();
    Linking.openURL(`tel:${city.emergency}`).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.iconContainer}>
            <Text style={styles.alertEmoji}>🚨</Text>
          </View>

          <Text style={styles.title}>Emergency SOS Calling</Text>
          <Text style={styles.subtitle}>
            Are you sure you want to dial emergency services for{" "}
            <Text style={styles.bold}>{city.name}, {city.country}</Text>?
          </Text>

          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>Dialing: {city.emergency}</Text>
          </View>

          <Text style={styles.disclaimer}>
            This connects directly to local emergency police, medical, or fire services.
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Text style={styles.callButtonText}>Call {city.emergency}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(28, 24, 38, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radii.xl,
    padding: 24,
    alignItems: "center",
    ...THEME.shadows.card,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  alertEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: THEME.colors.ink,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.inkMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 14,
  },
  bold: {
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  numberBadge: {
    backgroundColor: "#FEF2F2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 12,
  },
  numberText: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.colors.danger,
    letterSpacing: 0.5,
  },
  disclaimer: {
    fontSize: 11,
    color: THEME.colors.inkSubtle,
    textAlign: "center",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: THEME.radii.md,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.inkMuted,
  },
  callButton: {
    flex: 1.5,
    paddingVertical: 13,
    borderRadius: THEME.radii.md,
    backgroundColor: THEME.colors.danger,
    alignItems: "center",
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
