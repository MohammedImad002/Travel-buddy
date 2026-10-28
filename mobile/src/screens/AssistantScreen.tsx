import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { THEME } from "../lib/theme";
import { useTrip } from "../lib/trip";
import {
  generateLocalTravelAdvice,
  QUICK_SUGGESTIONS,
  type AssistantMessage,
} from "../lib/assistant";

let SpeechModule: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SpeechModule = require("expo-speech");
} catch {
  // Optional speech module
}

export function AssistantScreen({
  onOpenCityPicker,
}: {
  onOpenCityPicker: () => void;
}) {
  const { destination } = useTrip();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<any>(null);

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your Travel Buddy in ${destination.name}. Ask me anything: where to find authentic halal food, how to get around on a budget, or a 1-day plan!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Update welcome message when destination changes
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${destination.id}`,
        role: "assistant",
        content: `Welcome to ${destination.name}, ${destination.country}! I'm here to help you explore, dine, and navigate like a local. What would you like to know?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [destination.id]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || loading) return;

    const userMsg: AssistantMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const replyText = generateLocalTravelAdvice(query, destination);
      const botMsg: AssistantMessage = {
        id: `b-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 400);
  };

  const handleSpeak = (text: string) => {
    try {
      if (SpeechModule) {
        SpeechModule.stop();
        SpeechModule.speak(text, { language: "en" });
      }
    } catch {
      // ignore
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🤖 Travel AI Assistant</Text>
          <Text style={styles.subtitle}>
            Your pocket expert for {destination.name}
          </Text>
        </View>

        <TouchableOpacity style={styles.cityBtn} onPress={onOpenCityPicker}>
          <Text style={styles.cityBtnText}>{destination.flag} {destination.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Messages ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <View
              key={msg.id}
              style={[
                styles.messageBubbleWrapper,
                isUser ? styles.userBubbleWrapper : styles.botBubbleWrapper,
              ]}
            >
              {!isUser && (
                <View style={styles.botAvatar}>
                  <Text style={styles.botAvatarText}>✦</Text>
                </View>
              )}

              <View
                style={[
                  styles.messageBubble,
                  isUser ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.userMessageText : styles.botMessageText,
                  ]}
                >
                  {msg.content}
                </Text>

                <View style={styles.bubbleFooter}>
                  <Text
                    style={[
                      styles.timestamp,
                      isUser ? styles.userTimestamp : styles.botTimestamp,
                    ]}
                  >
                    {msg.timestamp}
                  </Text>

                  {!isUser && (
                    <TouchableOpacity
                      onPress={() => handleSpeak(msg.content)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={styles.speakBtn}
                    >
                      <Text style={styles.speakIcon}>🔊</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        {loading && (
          <View style={styles.botBubbleWrapper}>
            <View style={styles.botAvatar}>
              <Text style={styles.botAvatarText}>✦</Text>
            </View>
            <View style={[styles.messageBubble, styles.botBubble, { paddingVertical: 12 }]}>
              <Text style={styles.typingText}>Consulting local travel brain…</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Prompts Chips */}
      <View style={styles.suggestionsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsScroll}
        >
          {QUICK_SUGGESTIONS.map((sugg, i) => (
            <TouchableOpacity
              key={i}
              style={styles.suggestionPill}
              onPress={() => handleSend(sugg)}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestionText}>{sugg}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Box */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          placeholder={`Ask about ${destination.name}…`}
          placeholderTextColor={THEME.colors.inkSubtle}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
        />

        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={() => handleSend()}
          disabled={!input.trim() || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.colors.cream,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
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
    backgroundColor: "#FFFFFF",
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
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 10,
  },
  messageBubbleWrapper: {
    flexDirection: "row",
    marginBottom: 14,
    maxWidth: "88%",
  },
  userBubbleWrapper: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
  botBubbleWrapper: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.colors.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginTop: 4,
  },
  botAvatarText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  messageBubble: {
    borderRadius: THEME.radii.lg,
    paddingHorizontal: 15,
    paddingVertical: 12,
    ...THEME.shadows.sm,
  },
  userBubble: {
    backgroundColor: THEME.colors.brandPrimary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  botMessageText: {
    color: THEME.colors.ink,
  },
  bubbleFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 5,
    gap: 8,
  },
  timestamp: {
    fontSize: 10,
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  botTimestamp: {
    color: THEME.colors.inkSubtle,
  },
  speakBtn: {
    padding: 2,
  },
  speakIcon: {
    fontSize: 11,
  },
  typingText: {
    fontSize: 13,
    fontStyle: "italic",
    color: THEME.colors.inkMuted,
  },
  suggestionsContainer: {
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  suggestionsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionPill: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.ink,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: THEME.radii.full,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 14,
    color: THEME.colors.ink,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: THEME.colors.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: -2,
  },
});
