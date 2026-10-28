import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { THEME } from "../lib/theme";
import { GlassCard } from "../components/GlassCard";
import { useTrip } from "../lib/trip";
import {
  CURRENCIES,
  fetchExchangeRates,
  type CurrencyRates,
} from "../lib/rates";

const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "AED", "INR", "SGD", "JPY", "THB"];
const QUICK_AMOUNTS = ["10", "50", "100", "500"];

export function CurrencyScreen({
  onBack,
  onOpenCityPicker,
}: {
  onBack?: () => void;
  onOpenCityPicker: () => void;
}) {
  const { home, destination } = useTrip();
  const [fromCode, setFromCode] = useState(home.currency);
  const [toCode, setToCode] = useState(destination.currency);
  const [amountStr, setAmountStr] = useState("100");
  const [ratesData, setRatesData] = useState<CurrencyRates | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync to destination currency
  useEffect(() => {
    setToCode(destination.currency);
  }, [destination.currency]);

  // Sync from home currency
  useEffect(() => {
    setFromCode(home.currency);
  }, [home.currency]);

  // Fetch exchange rates
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchExchangeRates(fromCode).then((res) => {
      if (active) {
        setRatesData(res);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [fromCode]);

  const parsedAmount = parseFloat(amountStr) || 0;
  const currentRate = ratesData?.rates[toCode] ?? 1.0;
  const convertedAmount = parsedAmount * currentRate;

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
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
            <Text style={styles.title}>💱 Currency Converter</Text>
            <Text style={styles.subtitle}>
              Live rates, updated daily
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.cityBtn} onPress={onOpenCityPicker}>
          <Text style={styles.cityBtnText}>{destination.flag} {destination.currency}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Converter Card */}
      <GlassCard style={styles.converterCard}>
        {/* Amount Input */}
        <Text style={styles.inputLabel}>AMOUNT</Text>
        <TextInput
          style={styles.amountInput}
          keyboardType="numeric"
          value={amountStr}
          onChangeText={setAmountStr}
          placeholder="0"
          placeholderTextColor={THEME.colors.inkSubtle}
        />

        {/* Quick Amount Chips */}
        <View style={styles.quickChips}>
          {QUICK_AMOUNTS.map((amt) => (
            <TouchableOpacity
              key={amt}
              style={[
                styles.quickChip,
                amountStr === amt && styles.quickChipActive,
              ]}
              onPress={() => setAmountStr(amt)}
            >
              <Text
                style={[
                  styles.quickChipText,
                  amountStr === amt && styles.quickChipTextActive,
                ]}
              >
                +{amt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Currency Selector Row with Swap */}
        <View style={styles.currencySelectorRow}>
          {/* FROM */}
          <View style={styles.selectorCol}>
            <Text style={styles.selectorLabel}>FROM</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
              {CURRENCIES.map((c) => (
                <TouchableOpacity
                  key={c.code}
                  style={[
                    styles.currencyBadge,
                    fromCode === c.code && styles.currencyBadgeActive,
                  ]}
                  onPress={() => setFromCode(c.code)}
                >
                  <Text
                    style={[
                      styles.currencyBadgeText,
                      fromCode === c.code && styles.currencyBadgeTextActive,
                    ]}
                  >
                    {c.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* SWAP BUTTON */}
          <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
            <Text style={styles.swapText}>⇄</Text>
          </TouchableOpacity>

          {/* TO */}
          <View style={styles.selectorCol}>
            <Text style={styles.selectorLabel}>TO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
              {CURRENCIES.map((c) => (
                <TouchableOpacity
                  key={c.code}
                  style={[
                    styles.currencyBadge,
                    toCode === c.code && styles.currencyBadgeActive,
                  ]}
                  onPress={() => setToCode(c.code)}
                >
                  <Text
                    style={[
                      styles.currencyBadgeText,
                      toCode === c.code && styles.currencyBadgeTextActive,
                    ]}
                  >
                    {c.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Converted Output Display */}
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>
            {amountStr} {fromCode} =
          </Text>
          <Text style={styles.resultValue}>
            {convertedAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {toCode}
          </Text>
          <Text style={styles.rateRatio}>
            1 {fromCode} = {currentRate.toFixed(4)} {toCode}
          </Text>
        </View>
      </GlassCard>

      {/* Popular Comparison Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Comparisons</Text>
        <Text style={styles.sectionSubtitle}>
          {amountStr} {fromCode} in major world currencies
        </Text>
      </View>

      <View style={styles.comparisonGrid}>
        {POPULAR_CURRENCIES.filter((code) => code !== fromCode).map((code) => {
          const rate = ratesData?.rates[code] ?? 1.0;
          const val = parsedAmount * rate;
          return (
            <View key={code} style={styles.comparisonCard}>
              <Text style={styles.compCode}>{code}</Text>
              <Text style={styles.compValue}>
                {val.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              <Text style={styles.compRate}>1 {fromCode} = {rate.toFixed(3)}</Text>
            </View>
          );
        })}
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
  converterCard: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: THEME.colors.brandPrimary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "800",
    color: THEME.colors.ink,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: THEME.radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  quickChips: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    marginBottom: 16,
  },
  quickChip: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  quickChipActive: {
    backgroundColor: THEME.colors.brandPrimary,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  quickChipTextActive: {
    color: "#FFFFFF",
  },
  currencySelectorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  selectorCol: {
    flex: 1,
  },
  selectorLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: THEME.colors.inkMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  currencyScroll: {
    flexGrow: 0,
  },
  currencyBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: THEME.radii.md,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  currencyBadgeActive: {
    backgroundColor: THEME.colors.brandPrimary,
  },
  currencyBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  currencyBadgeTextActive: {
    color: "#FFFFFF",
  },
  swapBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  swapText: {
    fontSize: 18,
    color: THEME.colors.brandPrimary,
    fontWeight: "700",
  },
  resultBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  resultLabel: {
    fontSize: 12,
    color: THEME.colors.inkMuted,
    fontWeight: "600",
  },
  resultValue: {
    fontSize: 26,
    fontWeight: "800",
    color: THEME.colors.brandPrimary,
    marginVertical: 4,
  },
  rateRatio: {
    fontSize: 11,
    color: THEME.colors.inkSubtle,
    fontWeight: "500",
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
  comparisonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  comparisonCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: THEME.radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    ...THEME.shadows.sm,
  },
  compCode: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.colors.ink,
  },
  compValue: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.colors.brandPrimary,
    marginVertical: 3,
  },
  compRate: {
    fontSize: 10,
    color: THEME.colors.inkMuted,
  },
});
