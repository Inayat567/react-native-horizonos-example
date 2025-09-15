import { Text, TextProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export type RNTextProps = TextProps & {
  color?: 'primary' | 'secondary';
};

export const RNText = ({ color, style, ...props }: RNTextProps) => {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        {
          color:
            color === 'secondary' ? colors.textSecondary : colors.textPrimary,
        },
        style,
      ]}
      {...props}
    />
  );
};
