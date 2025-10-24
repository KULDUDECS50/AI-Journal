import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function NewEntryScreen() {
  const [entry, setEntry] = useState('');
  const wordCount = entry.trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
        <Text style={styles.wordCount}>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </Text>
      </View>

      {/* Writing Area */}
      <ScrollView style={styles.scrollView}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Start writing about what's on your mind..."
          placeholderTextColor="#9ca3af"
          value={entry}
          onChangeText={setEntry}
          autoFocus
        />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>✨ Go Deeper</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>💬 Talk More</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.finishButton}>
          <Text style={styles.finishButtonText}>✅ Finish Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
  },
  wordCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
    minHeight: 300,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#f9fafb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  finishButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
