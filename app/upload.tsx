import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { colors, typography, spacing, borderRadius } from '../src/theme';
import { useAuth } from '../src/context/AuthContext';
import { Button } from '../src/components/common/Button';

export default function UploadScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      setFile(result.assets[0]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const API_URL = 'http://172.17.99.224:3000/api';
      
      // Convert the local file URI to a Blob
      const fileResponse = await fetch(file.uri);
      const blob = await fileResponse.blob();

      const formData = new FormData();
      formData.append('document', blob, file.name || 'upload.bin');

      const response = await fetch(`${API_URL}/memory/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed with status ' + response.status);
      }

      Alert.alert('Success', 'Document uploaded and is being analyzed by Health Memory.');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Health Record</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        {!file ? (
          <TouchableOpacity style={styles.dropzone} onPress={pickDocument}>
            <Ionicons name="cloud-upload-outline" size={48} color={colors.primary.teal} />
            <Text style={styles.dropzoneTitle}>Tap to select a document</Text>
            <Text style={styles.dropzoneSubtitle}>Supports PDF, JPG, PNG</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.fileSelectedCard}>
            <View style={styles.fileIcon}>
              <Ionicons name="document-text" size={32} color={colors.primary.deepBlue} />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              <Text style={styles.fileSize}>{(file.size || 0) / 1000} KB</Text>
            </View>
            <TouchableOpacity onPress={() => setFile(null)}>
              <Ionicons name="trash-outline" size={24} color={colors.status.error} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.primary.deepBlue} />
          <Text style={styles.infoText}>
            Gemini AI will securely extract conditions, medications, and dates from your document and add them to your Health Memory timeline.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title={isUploading ? "Uploading & Analyzing..." : "Upload Document"} 
          onPress={handleUpload}
          disabled={!file || isUploading}
        />
      </View>
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
  backButton: { width: 40, alignItems: 'center' },
  content: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  dropzone: {
    borderWidth: 2,
    borderColor: colors.primary.tealSoft,
    borderStyle: 'dashed',
    borderRadius: borderRadius.xl,
    padding: spacing.xxxl,
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
  },
  dropzoneTitle: { ...typography.bodySemibold, color: colors.text.primary, marginTop: spacing.md },
  dropzoneSubtitle: { ...typography.small, color: colors.text.secondary, marginTop: spacing.xs },
  fileSelectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primary.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  fileInfo: { flex: 1 },
  fileName: { ...typography.bodySemibold, color: colors.text.primary },
  fileSize: { ...typography.small, color: colors.text.secondary },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F0FE',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: spacing.xxl,
    alignItems: 'flex-start',
  },
  infoText: {
    ...typography.small,
    color: colors.primary.deepBlue,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    padding: spacing.xl,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  }
});
