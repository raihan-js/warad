import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AyahCardProps {
  arabic: string;
  translation?: string;
}

export default function AyahCard({ arabic, translation }: AyahCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.arabicText}>{arabic}</Text>
      {translation && <Text style={styles.translation}>{translation}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  arabicText: {
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 40,
    fontFamily: 'System',
    color: '#333',
  },
  translation: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    color: '#777',
  },
});
