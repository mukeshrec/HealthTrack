import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function ChatScreen() {
  const { patientId } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();
  
  const [messages, setMessages] = useState([
    { id: '1', text: "Hello! I'm the Health Memory AI. Ask me any questions about this patient's medical history, such as allergies, past medications, or upcoming appointments.", sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('http://172.17.99.224:3000/api/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ patientId, message: userMsg.text })
      });

      if (!response.ok) throw new Error('Failed to fetch reply');
      
      const data = await response.json();
      const aiMsg = { id: (Date.now() + 1).toString(), text: data.reply, sender: 'ai' };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errMsg = { id: (Date.now() + 1).toString(), text: "Sorry, I couldn't connect to the Health Memory right now.", sender: 'ai' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.messageUser : styles.messageAI]}>
        {!isUser && (
          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={12} color={colors.neutral.white} />
          </View>
        )}
        <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAI]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Memory Chat</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={colors.primary.teal} />
          <Text style={styles.typingText}>Health Memory AI is thinking...</Text>
        </View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about medications, allergies..."
            placeholderTextColor={colors.text.tertiary}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() ? styles.sendBtnDisabled : null]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color={colors.neutral.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: { ...typography.h3, color: colors.text.primary },
  backBtn: { padding: spacing.xs },
  chatContainer: { padding: spacing.lg, paddingBottom: spacing.xxl },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  messageUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary.deepBlue,
    borderBottomRightRadius: 0,
  },
  messageAI: {
    alignSelf: 'flex-start',
    backgroundColor: colors.neutral.white,
    borderBottomLeftRadius: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aiIcon: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary.teal,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm, marginTop: 2,
  },
  messageText: { ...typography.body, lineHeight: 22 },
  messageTextUser: { color: colors.neutral.white },
  messageTextAI: { color: colors.text.primary, flex: 1 },
  typingIndicator: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingBottom: spacing.md,
  },
  typingText: { ...typography.small, color: colors.text.secondary, marginLeft: spacing.sm },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 100,
    ...typography.body,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primary.teal,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: spacing.md,
    marginBottom: 2,
  },
  sendBtnDisabled: {
    backgroundColor: colors.neutral.gray300,
  }
});
