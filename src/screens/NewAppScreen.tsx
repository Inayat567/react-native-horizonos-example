import {
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
  Image,
  Platform,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { RNText } from '@/components/RNText';
import { links } from '@/utils/links';
import { RNButton } from '@/components/RNButton';
import { useNavigation } from '@/navigation/useNavigation';
import { demos } from '@/utils/demos';

export const NewAppScreen = () => {
  const { colors } = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
  const isLargeScreen = useWindowDimensions().width > 600;
  const navigation = useNavigation();

  const openURLInBrowser = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingTop: safeAreaInsets.top,
        paddingLeft: safeAreaInsets.left,
        paddingRight: safeAreaInsets.right,
      }}
    >
      <ScrollView style={{ paddingBottom: safeAreaInsets.bottom }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={
                isDarkMode
                  ? require('../assets/react-dark.png')
                  : require('../assets/react-light.png')
              }
            />
            <RNText style={styles.title}>Welcome to React Native</RNText>
            {getVersionLabel()}
            {getHermesLabel()}
            <RNText
              style={[
                styles.callout,
                { backgroundColor: colors.backgroundHighlight },
              ]}
            >
              💡&ensp;Open{' '}
              <RNText style={styles.calloutEmphasis}>App.tsx</RNText> to get
              started
            </RNText>
          </View>
          <View style={styles.linksContainer}>
            <RNText style={styles.linksTitle}>
              Explore Horizon OS features
            </RNText>
            {demos.map(({ id, name, description, screen }) => (
              <RNButton
                key={id}
                style={{ maxWidth: isLargeScreen ? 240 : 360 }}
                title={name}
                description={description}
                onPress={() => navigation.navigate(screen)}
              />
            ))}
          </View>
          <View style={styles.linksContainer}>
            <RNText style={styles.linksTitle}>Learn & Explore</RNText>
            {links.map(({ title, description, url }, i) => (
              <RNButton
                key={i}
                style={{ maxWidth: isLargeScreen ? 240 : 360 }}
                title={title}
                description={description}
                onPress={() => openURLInBrowser(url)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const getVersionLabel = () => {
  const version =
    [
      Platform.constants.reactNativeVersion.major,
      Platform.constants.reactNativeVersion.minor,
      Platform.constants.reactNativeVersion.patch,
    ].join('.') +
    (Platform.constants.reactNativeVersion.prerelease != null
      ? '-' + Platform.constants.reactNativeVersion.prerelease
      : '');

  return (
    <RNText color="secondary" style={styles.label}>
      Version: {version}
    </RNText>
  );
};

const getHermesLabel = () => {
  if (!('HermesInternal' in globalThis)) {
    return null;
  }

  return (
    <RNText color="secondary" style={styles.label}>
      JS Engine: Hermes
    </RNText>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 64,
    marginBottom: 48,
  },
  logo: {
    height: 80,
    aspectRatio: 1,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  callout: {
    width: '100%',
    maxWidth: 320,
    marginTop: 36,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingLeft: 16,
    borderRadius: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  calloutEmphasis: {
    fontWeight: 'bold',
  },
  linksContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 12,
    rowGap: 12,
    maxWidth: 800,
    marginBottom: 48,
  },
  linksTitle: {
    width: '100%',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
});
