// app/surah/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuran } from '../../context/QuranContext';
import { useSoundEffect } from '../../hooks/useSoundEffect';
import { Ayah, fetchSurahDetails } from '../../services/quranService';

export default function SurahScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { surahs, setLastRead } = useQuran();
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const [playingAyahId, setPlayingAyahId] = useState<number | null>(null);
  
  const { isPlaying, playSound, stopSound, error: audioError } = useSoundEffect();
  
  const surahId = parseInt(id as string);
  const currentSurah = surahs.find(s => s.id === surahId);

  // Set the dynamic header title
  useEffect(() => {
    if (currentSurah) {
      // This will update the header title
      router.setParams({ title: currentSurah.name_simple });
    }
  }, [currentSurah, router]);

  useEffect(() => {
    const loadSurahDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchSurahDetails(surahId);
        setAyahs(data);
      } catch (error) {
        console.error('Failed to load surah details:', error);
        setError('Failed to load surah details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSurahDetails();
  }, [surahId]);

  // Show alert if there's an audio error
  useEffect(() => {
    if (audioError) {
      Alert.alert('Audio Error', audioError);
    }
  }, [audioError]);

  const handlePlayAyah = async (ayah: Ayah) => {
    try {
      // If we're clicking on the same ayah that's already playing, just stop it
      if (playingAyahId === ayah.id && isPlaying) {
        await stopSound();
        setPlayingAyahId(null);
        return;
      }

      // Play the new ayah
      const success = await playSound(ayah.audio_url);
      
      if (success) {
        setPlayingAyahId(ayah.id);
        setSelectedAyah(ayah.number);
        
        // Update last read
        if (currentSurah) {
          setLastRead({
            surahId,
            ayahNumber: ayah.number,
            surahName: currentSurah.name_simple,
          });
        }
      }
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FACC15" />
        <Text style={styles.loadingText}>Loading surah details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#FACC15" />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable 
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Set the dynamic header title */}
      <Stack.Screen 
        options={{
          title: currentSurah?.name_simple || "Surah",
          headerBackTitle: "Back",
        }}
      />

      {/* Bismillah */}
      {surahId !== 9 && (
        <View style={styles.bismillahContainer}>
          <Text style={styles.bismillahText}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        </View>
      )}
    
      {/* Surah Info */}
      <View style={styles.surahInfoContainer}>
        <Text style={styles.surahTitle}>{currentSurah?.name_simple || "Surah"}</Text>
        <Text style={styles.surahSubtitle}>{currentSurah?.translated_name?.name || ""}</Text>
        <Text style={styles.surahMeta}>
          {currentSurah?.revelation_place 
            ? `${currentSurah.revelation_place.charAt(0).toUpperCase()}${currentSurah.revelation_place.slice(1)}` 
            : 'Unknown'} • {currentSurah?.verses_count ?? 0} Verses
        </Text>
      </View>

      {/* Ayahs List */}
      <FlatList
        data={ayahs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.ayahsContainer}
        renderItem={({ item }) => (
          <Pressable 
            style={[
              styles.ayahCard,
              selectedAyah === item.number && styles.selectedAyahCard
            ]}
            onLongPress={() => {
              if (currentSurah) {
                setLastRead({
                  surahId,
                  ayahNumber: item.number,
                  surahName: currentSurah.name_simple,
                });
              }
            }}
          >
            {/* Ayah Number */}
            <View style={styles.ayahNumberContainer}>
              <Text style={styles.ayahNumber}>{item.number}</Text>
            </View>
            
            {/* Ayah Content */}
            <View style={styles.ayahContent}>
              <Text style={styles.arabicText}>{item.text}</Text>
              <Text style={styles.translationText}>{item.translation}</Text>
              
              {/* Controls */}
              <View style={styles.controlsContainer}>
                {/* Play Button */}
                <Pressable 
                  style={[
                    styles.controlButton,
                    playingAyahId === item.id && isPlaying && styles.activeControlButton
                  ]}
                  onPress={() => handlePlayAyah(item)}
                >
                  <Ionicons 
                    name={playingAyahId === item.id && isPlaying ? "pause" : "play"} 
                    size={18} 
                    color={playingAyahId === item.id && isPlaying ? "#1A202C" : "#FACC15"} 
                  />
                  <Text 
                    style={[
                      styles.controlText,
                      playingAyahId === item.id && isPlaying && styles.activeControlText
                    ]}
                  >
                    {playingAyahId === item.id && isPlaying ? "Pause" : "Play"}
                  </Text>
                </Pressable>
                
                {/* Bookmark Button */}
                <Pressable 
                  style={styles.controlButton}
                  onPress={() => {
                    if (currentSurah) {
                      setLastRead({
                        surahId,
                        ayahNumber: item.number,
                        surahName: currentSurah.name_simple,
                      });
                    }
                  }}
                >
                  <Ionicons name="bookmark-outline" size={18} color="#FACC15" />
                  <Text style={styles.controlText}>Bookmark</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

// Update styles to remove the custom header styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FACC15',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FACC15',
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FACC15',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#1A202C',
    fontWeight: 'bold',
  },
  // New surah info container
  surahInfoContainer: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  surahTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FACC15',
  },
  surahSubtitle: {
    fontSize: 16,
    color: '#A1A1AA',
    marginTop: 4,
  },
  surahMeta: {
    fontSize: 14,
    color: '#A1A1AA',
    marginTop: 8,
  },
  bismillahContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  bismillahText: {
    fontSize: 24,
    color: '#FACC15',
  },
  ayahsContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  ayahCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  selectedAyahCard: {
    borderWidth: 2,
    borderColor: '#FACC15',
  },
  ayahNumberContainer: {
    backgroundColor: '#2D3748',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
  },
  ayahNumber: {
    color: '#FACC15',
    fontWeight: '600',
  },
  ayahContent: {
    padding: 16,
  },
  arabicText: {
    fontSize: 22,
    lineHeight: 40,
    color: '#FFFFFF',
    textAlign: 'right',
    marginBottom: 16,
  },
  translationText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#A1A1AA',
    marginBottom: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#4A5568',
    paddingTop: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeControlButton: {
    backgroundColor: '#FACC15',
  },
  controlText: {
    color: '#FACC15',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  activeControlText: {
    color: '#1A202C',
  },
});