import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Play, Pause, Music, Volume2, Share2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { RNText } from '@/components/RNText';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';

export type Track = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
  artwork: string;
};

export type TrackItemProps = {
  track: Track;
  isPlaying: boolean;
  onPress: () => void;
};

const TrackItem = ({ track, isPlaying, onPress }: TrackItemProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.trackItem,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardOutline,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.trackInfo}>
        <View
          style={[
            styles.trackIcon,
            { backgroundColor: colors.backgroundHighlight },
          ]}
        >
          <Music size={20} color={colors.textPrimary} />
        </View>
        <View style={styles.trackDetails}>
          <RNText style={styles.trackTitle}>{track.title}</RNText>
          <RNText color="secondary" style={styles.trackArtist}>
            {track.artist}
          </RNText>
        </View>
      </View>
      <View style={styles.trackControls}>
        <RNText color="secondary" style={styles.trackDuration}>
          {track.duration}
        </RNText>
        <View
          style={[
            styles.playButton,
            {
              backgroundColor: colors.backgroundHighlight,
              borderColor: colors.cardOutline,
            },
            isPlaying && styles.playButtonActive,
          ]}
        >
          {isPlaying ? (
            <Pause size={16} color={colors.textPrimary} />
          ) : (
            <Play size={16} color={colors.textPrimary} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Sample royalty-free music tracks
const tracks: Track[] = [
  {
    id: 'morning',
    title: 'Morning',
    artist: 'Kevin MacLeod (incompetech.com)',
    duration: '2:33',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Morning.mp3',
    artwork: 'https://incompetech.com/images/music-117x117.png',
  },
  {
    id: 'evening',
    title: 'Evening',
    artist: 'Kevin MacLeod (incompetech.com)',
    duration: '3:06',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Evening.mp3',
    artwork: 'https://incompetech.com/images/music-117x117.png',
  },
];

export const BackgroundAudioScreen = () => {
  const { colors } = useTheme();

  // Use custom hook for audio playback
  const { currentTrackId, isPlaying, isLoading, error, playTrack, shareTrack } =
    useAudioPlayback();

  const handleTrackPress = async (track: Track) => {
    await playTrack(track);
  };

  const handleShareTrack = async () => {
    if (!currentTrackId) {
      return;
    }

    const currentTrack = tracks.find(t => t.id === currentTrackId);
    if (!currentTrack) return;

    await shareTrack(currentTrack);
  };

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TrackItem
      track={item}
      isPlaying={isPlaying && currentTrackId === item.id}
      onPress={() => handleTrackPress(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.cardOutline,
          },
        ]}
      >
        <View style={styles.headerIcon}>
          <Volume2 size={24} color="#ffffff" />
        </View>
        <View style={styles.headerText}>
          <RNText style={styles.headerTitle}>Background Audio</RNText>
        </View>
      </View>

      {/* Tracks List */}
      <View style={styles.tracksContainer}>
        <FlatList
          data={tracks}
          renderItem={renderTrackItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tracksList}
        />
      </View>

      {/* Current Track Info */}
      {currentTrackId && (
        <View
          style={[
            styles.currentTrackContainer,
            {
              backgroundColor: colors.cardBackground,
              borderTopColor: colors.cardOutline,
            },
          ]}
        >
          <View style={styles.currentTrackInfo}>
            <Music size={16} color="#007AFF" />
            <RNText style={styles.currentTrackText}>
              {tracks.find(t => t.id === currentTrackId)?.title} -{' '}
              {tracks.find(t => t.id === currentTrackId)?.artist}
            </RNText>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareTrack}
            >
              <Share2 size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Attribution */}
      <View
        style={[
          styles.attributionContainer,
          {
            backgroundColor: colors.cardBackground,
            borderTopColor: colors.cardOutline,
          },
        ]}
      >
        <RNText color="secondary" style={styles.attributionText}>
          Licensed under Creative Commons: By Attribution 4.0 License
        </RNText>
        <RNText style={styles.attributionLink}>
          http://creativecommons.org/licenses/by/4.0/
        </RNText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tracksContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tracksList: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  trackItem: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trackIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trackDetails: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
  },
  trackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trackDuration: {
    fontSize: 14,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  playButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  currentTrackContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  currentTrackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentTrackText: {
    fontSize: 14,
    flex: 1,
  },
  shareButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  attributionContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  attributionText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  attributionLink: {
    fontSize: 11,
    color: '#007AFF',
    textAlign: 'center',
  },
});
