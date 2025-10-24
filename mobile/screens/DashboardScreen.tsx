import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function DashboardScreen() {
  // Sample data
  const stats = [
    { label: 'Total Entries', value: '12' },
    { label: 'Current Streak', value: '5 days' },
    { label: 'This Week', value: '3' },
  ];

  const entries = [
    {
      id: '1',
      date: 'Today, 2:30 PM',
      preview: 'Had a really productive day at work. Feeling grateful for...',
      mood: '😊',
    },
    {
      id: '2',
      date: 'Yesterday, 9:15 AM',
      preview: 'Woke up feeling a bit anxious about the presentation...',
      mood: '😐',
    },
    {
      id: '3',
      date: '2 days ago',
      preview: 'Spent time with family today. It reminded me of how...',
      mood: '😊',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Journal</Text>
        <Text style={styles.subtitle}>Reflect, grow, and understand yourself better</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Recent Entries */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Entries</Text>
        {entries.map((entry) => (
          <TouchableOpacity key={entry.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryDate}>{entry.date}</Text>
              <Text style={styles.entryMood}>{entry.mood}</Text>
            </View>
            <Text style={styles.entryPreview}>{entry.preview}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  entryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  entryMood: {
    fontSize: 20,
  },
  entryPreview: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
