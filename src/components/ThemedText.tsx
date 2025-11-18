// Re-export ThemedText from root components
export { ThemedText } from '../../components/themed-text';

// Helper function for backwards compatibility
export const createText = () => {
  const { ThemedText } = require('../../components/themed-text');
  return ThemedText;
};
