/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useTheme } from '@/src/hooks/useTheme';

// Bu dosya artık kullanılmayacak, ancak diğer dosyaların import hatalarını önlemek için boş bırakıldı.
// Tüm tema renkleri artık useThemedStyles hook'u üzerinden erişilebilir.
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  const { colors } = useTheme();
  
  // Bu fonksiyonun işlevi artık useThemedStyles içinde yapılıyor.
  // Geriye dönük uyumluluk için geçici bir çözüm.
  // Ensure we always return a string color value
  if (typeof colors.primary === 'string') {
    return colors.primary;
  }
  if (typeof colors.text === 'string') {
    return colors.text;
  }
  // Ultimate fallback to a safe color
  return '#000000';
}
