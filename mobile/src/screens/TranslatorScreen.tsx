import React, { useState } from "react";
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
  LANGUAGES,
  getPhrasebookForLanguage,
  getSmartTranslation,
  type PhraseItem,
} from "../lib/translator";

let SpeechModule: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SpeechModule = require("expo-speech");
} catch {
  // Optional speech module
}

export function TranslatorScreen({
  onBack,
  onOpenCityPicker,
}: {
  onBack?: () => void;
  onOpenCityPicker: () => void;
}) {
  const { destination } = useTrip();
  const [fromLang, setFromLang] = useState("English");
  const [toLang, setToLang] = useState(destination.language);
  const [inputText, setInputText] = useState("");
  const [activeTranslation, setActiveTranslation] = useState<{
    original: string;
    translation: string;
    pronunciation: string;
    note: string;
  } | null>(null);

  const phrasebook = getPhrasebookForLanguage(toLang);

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    const res = getSmartTranslation(inputText, fromLang, toLang);
    setActiveTranslation({
      original: inputText,
      translation: res.translation,
      pronunciation: res.pronunciation,
      note: res.note,
    });
  };

  const handleSelectPhrase = (phrase: PhraseItem) => {
    setInputText(phrase.original);
    setActiveTranslation({
      original: phrase.original,
      translation: phrase.translation,
      pronunciation: phrase.pronunciation,
      note: phrase.note,
    });
  };

  const handleSpeak = (text: string) => {
    try {
      if (SpeechModule) {
        SpeechModule.stop();
        SpeechModule.speak(text);
      }
    } catch {
      // ignore
    }
  };

  const swapLanguages = () => {
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
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
            <Text style={styles.title}>🌐 Travel Translator</Text>
            <Text style={styles.subtitle}>
              Say it like a local in {destination.name}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.cityBtn} onPress={onOpenCityPicker}>
          <Text style={styles.cityBtnText}>{destination.flag} {destination.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Language Selector Bar */}
      <GlassCard style={styles.langBar}>
        <View style={styles.langSelector}>
          <Text style={styles.langLabel}>FROM</Text>
          <Text style={styles.langName}>{fromLang}</Text>
        </View>

        <TouchableOpacity style={styles.swapBtn} onPress={swapLanguages}>
          <Text style={styles.swapIcon}>⇄</Text>
        </TouchableOpacity>

        <View style={styles.langSelector}>
          <Text style={styles.langLabel}>TO</Text>
          <Text style={styles.langName}>{toLang}</Text>
        </View>
      </GlassCard>

      {/* Input Box Card */}
      <GlassCard style={styles.inputCard}>
        <TextInput
          style={styles.textInput}
          placeholder={`Type words or phrase to translate to ${toLang}…`}
          placeholderTextColor={THEME.colors.inkSubtle}
          multiline
          value={inputText}
          onChangeText={setInputText}
        />

        <View style={styles.actionRow}>
          {inputText.length > 0 && (
            <TouchableOpacity onPress={() => setInputText("")} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.translateBtn, !inputText.trim() && styles.translateBtnDisabled]}
            onPress={handleTranslate}
            disabled={!inputText.trim()}
          >
            <Text style={styles.translateBtnText}>Translate</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* Translation Result Card */}
      {activeTranslation && (
        <GlassCard style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultOriginal}>{activeTranslation.original}</Text>
            <TouchableOpacity
              onPress={() => handleSpeak(activeTranslation.translation)}
              style={styles.speakCircle}
            >
              <Text style={styles.speakEmoji}>🔊</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.resultTranslation}>
            {activeTranslation.translation}
          </Text>

          <View style={styles.phoneticBox}>
            <Text style={styles.phoneticLabel}>Pronunciation:</Text>
            <Text style={styles.phoneticText}>
              {activeTranslation.pronunciation}
            </Text>
          </View>

          {activeTranslation.note ? (
            <Text style={styles.noteText}>💡 {activeTranslation.note}</Text>
          ) : null}
        </GlassCard>
      )}

      {/* Quick Phrasebook Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Essential Travel Phrases</Text>
        <Text style={styles.sectionSubtitle}>
          Frequently used phrases with phonetic guides
        </Text>
      </View>

      <View style={styles.phraseList}>
        {phrasebook.map((phrase, i) => (
          <TouchableOpacity
            key={i}
            style={styles.phraseCard}
            onPress={() => handleSelectPhrase(phrase)}
            activeOpacity={0.7}
          >
            <View style={styles.phraseLeft}>
              <Text style={styles.phraseOriginal}>{phrase.original}</Text>
              <Text style={styles.phraseTranslation}>{phrase.translation}</Text>
              <Text style={styles.phrasePronunciation}>
                🗣️ {phrase.pronunciation}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handleSpeak(phrase.translation)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.phraseSpeakIcon}>🔊</Text>
            </TouchableOpacity>
          </TouchableOpacity>
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
    marginBottom: 12,
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
  langBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 12,
  },
  langSelector: {
    flex: 1,
  },
  langLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: THEME.colors.brandPrimary,
    letterSpacing: 1,
  },
  langName: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.colors.ink,
    marginTop: 2,
  },
  swapBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  swapIcon: {
    fontSize: 18,
    color: THEME.colors.brandPrimary,
    fontWeight: "700",
  },
  inputCard: {
    marginBottom: 14,
  },
  textInput: {
    fontSize: 15,
    color: THEME.colors.ink,
    minHeight: 70,
    textAlignVertical: "top",
    padding: 0,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearBtnText: {
    fontSize: 13,
    color: THEME.colors.inkMuted,
    fontWeight: "600",
  },
  translateBtn: {
    backgroundColor: THEME.colors.brandPrimary,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: THEME.radii.full,
  },
  translateBtnDisabled: {
    opacity: 0.5,
  },
  translateBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  resultCard: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderColor: "#E9D5FF",
    borderWidth: 1.5,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  resultOriginal: {
    fontSize: 13,
    color: THEME.colors.inkMuted,
  },
  speakCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  speakEmoji: {
    fontSize: 14,
  },
  resultTranslation: {
    fontSize: 22,
    fontWeight: "800",
    color: THEME.colors.ink,
    marginVertical: 4,
  },
  phoneticBox: {
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: THEME.radii.md,
    marginTop: 8,
  },
  phoneticLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: THEME.colors.inkSubtle,
    textTransform: "uppercase",
  },
  phoneticText: {
    fontSize: 13,
    fontWeight: "600",
    color: THEME.colors.brandPrimary,
    marginTop: 2,
  },
  noteText: {
    fontSize: 12,
    color: THEME.colors.inkMuted,
    marginTop: 8,
  },
  sectionHeader: {
    marginTop: 8,
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
  phraseList: {
    gap: 8,
  },
  phraseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: THEME.radii.lg,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    ...THEME.shadows.sm,
  },
  phraseLeft: {
    flex: 1,
    marginRight: 10,
  },
  phraseOriginal: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.ink,
  },
  phraseTranslation: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.brandPrimary,
    marginTop: 3,
  },
  phrasePronunciation: {
    fontSize: 11,
    color: THEME.colors.inkMuted,
    marginTop: 2,
  },
  phraseSpeakIcon: {
    fontSize: 16,
  },
});
