// Re-export ThemedText from root components
import { ThemedText as BaseThemedText } from '../../components/themed-text';
import { Theme } from '../hooks/useTheme';
import { Typography } from '../constants/Typography';

// ThemedText'in tipini genişletmek için Theme ve Typography'yi kullan
export type ThemedTextProps = React.ComponentProps<typeof BaseThemedText> & {
  type?: keyof typeof Typography;
  colorName?: keyof Theme['colors'];
};

export const ThemedText = BaseThemedText as React.FC<ThemedTextProps>;

// Helper function for backwards compatibility
export const createText = () => {
  const { ThemedText: BaseThemedText } = require('../../components/themed-text');
  const ThemedText = BaseThemedText as React.FC<ThemedTextProps>;
  return ThemedText;
};
