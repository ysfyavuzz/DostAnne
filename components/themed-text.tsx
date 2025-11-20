import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemedStyles } from '@/src/hooks/useThemedStyles';

export type ThemedTextProps = TextProps & {
  type?: keyof typeof Typography; // Typography sabitlerini kullan
  colorName?: keyof Theme['colors']; // useTheme'dan gelen dinamik renkleri kullan
};

export function ThemedText({
  style,
  type = 'body',
  colorName = 'text',
  ...rest
}: ThemedTextProps) {
  const { colors, typography } = useThemedStyles();

  // Dinamik renk seçimi
  const color = colors[colorName] || colors.text.primary;

  return (
    <Text
      style={[
        { color },
        typography[type], // Typography sabitlerini uygula
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({}); // Artık Typography.ts'den geldiği için boş bırakılabilir.
