// Re-export ThemedView from root components
export { ThemedView } from '../../components/themed-view';

// Helper function for backwards compatibility
export const createView = () => {
  const { ThemedView } = require('../../components/themed-view');
  return ThemedView;
};
