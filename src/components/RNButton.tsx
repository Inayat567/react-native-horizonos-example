import {
  StyleSheet,
  TouchableHighlight,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { RNText } from '@/components/RNText';

export type RNButtonProps = {
  title: string;
  style?: StyleProp<ViewStyle>;
  description: string;
  onPress?: () => void;
};

export const RNButton = ({
  title,
  description,
  onPress,
  style,
}: RNButtonProps) => {
  const { colors } = useTheme();

  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor={colors.background}
      onPress={onPress}
      style={[
        styles.link,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          borderColor: colors.cardOutline,
          backgroundColor: colors.cardBackground,
        },
        style,
      ]}
    >
      <View>
        <RNText style={styles.linkText}>{title}</RNText>
        <RNText style={{ color: colors.textSecondary }}>{description}</RNText>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  link: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    boxShadow: '0 4px 8px rgba(0, 0, 0, .03)',
  },
  linkText: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: '600',
  },
});
