import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useQuran } from '../../context/QuranContext';

export default function HomeScreen() {
  const router = useRouter();
  const { surahs, loading, error, lastRead } = useQuran();

  // For debugging
  console.log("Surahs data:", JSON.stringify(surahs.slice(0, 3)));

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FACC15" />
        <Text style={styles.loadingText}>Loading Quran data...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#FACC15" />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.appName}>Al-Quran</Text>
          <Text style={styles.subTitle}>Read & Listen to the Holy Quran</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="search" size={24} color="#FACC15" />
        </View>
      </View>

      {/* Last Read Section */}
      <LinearGradient
        colors={['#2D3748', '#1A202C']}
        style={styles.lastReadCard}
      >
        <View style={styles.lastReadContent}>
          <View>
            <Text style={styles.lastReadLabel}>Last Read</Text>
            <Text style={styles.lastReadSurah}>
              {lastRead ? lastRead.surahName : 'Al-Fatihah'}
            </Text>
            <Text style={styles.lastReadAyah}>
              Ayah No: {lastRead ? lastRead.ayahNumber : 1}
            </Text>
          </View>
          <Pressable 
            style={styles.readButton}
            onPress={() => {
              if (lastRead) {
                router.push({
                  pathname: '/surah/[id]',
                  params: { id: lastRead.surahId.toString() },
                });
              } else {
                router.push({
                  pathname: '/surah/[id]',
                  params: { id: '1' },
                });
              }
            }}
          >
            <Ionicons name="play" size={20} color="#1A202C" />
          </Pressable>
        </View>
        <View style={styles.decorativePattern}></View>
      </LinearGradient>

      {/* Surah List Section */}
      <View style={styles.surahListHeader}>
        <Text style={styles.sectionTitle}>📖 Surahs</Text>
        <Text style={styles.totalCount}>{surahs.length} Surahs</Text>
      </View>

      <FlatList
        data={surahs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Pressable
            style={styles.surahCard}
            onPress={() =>
              router.push({
                pathname: '/surah/[id]',
                params: { id: item.id.toString() },
              })
            }
          >
            <View style={styles.surahNumberContainer}>
              <Text style={styles.surahNumber}>{item.id}</Text>
            </View>
            <View style={styles.surahInfo}>
              <Text style={styles.surahName}>{item.name_simple}</Text>
              <Text style={styles.englishName}>{item.translated_name.name}</Text>
            </View>
            <View style={styles.surahMeta}>
              <Text style={styles.arabicName}>{item.name_arabic}</Text>
              <Ionicons name="chevron-forward" size={16} color="#A1A1AA" />
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  appName: {
    fontSize: 28,
    color: '#FACC15',
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 14,
    color: '#A1A1AA',
    marginTop: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastReadCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  lastReadContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastReadLabel: {
    fontSize: 12,
    color: '#A1A1AA',
    marginBottom: 4,
  },
  lastReadSurah: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  lastReadAyah: {
    fontSize: 14,
    color: '#FACC15',
    marginTop: 2,
  },
  readButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FACC15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativePattern: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 80,
    height: 80,
    opacity: 0.1,
  },
  surahListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FACC15',
    fontWeight: '700',
  },
  totalCount: {
    fontSize: 14,
    color: '#A1A1AA',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  surahNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  surahNumber: {
    color: '#FACC15',
    fontSize: 14,
    fontWeight: '600',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  englishName: {
    color: '#A1A1AA',
    fontSize: 13,
    marginTop: 2,
  },
  surahMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arabicName: {
    color: '#A1A1AA',
    fontSize: 14,
    marginRight: 4,
  },
});