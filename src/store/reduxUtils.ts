/**
 * Redux utility helpers for common patterns
 * Reduces code duplication in Redux slices
 */

import { PayloadAction } from '@reduxjs/toolkit';

/**
 * Creates a standard async thunk handler for loading operations
 * @param dispatch - Redux dispatch function
 * @param setLoading - Action to set loading state
 * @param setError - Action to set error state
 * @param operation - Async operation to perform
 */
export const createLoadingThunk = async <T>(
  dispatch: any,
  setLoading: (loading: boolean) => PayloadAction<boolean>,
  setError: (error: string | null) => PayloadAction<string | null>,
  operation: () => Promise<T>
): Promise<T | undefined> => {
  dispatch(setLoading(true));
  try {
    const result = await operation();
    dispatch(setError(null));
    return result;
  } catch (error) {
    dispatch(setError(error as string));
    return undefined;
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Creates a standard async thunk for data operations
 * @param setLoading - Action creator for loading state
 * @param setError - Action creator for error state
 * @param operation - Async operation to perform
 * @param successAction - Optional action to dispatch on success
 */
export const createDataThunk = <T>(
  setLoading: (loading: boolean) => PayloadAction<boolean>,
  setError: (error: string | null) => PayloadAction<string | null>,
  operation: () => Promise<T>,
  successAction?: (data: T) => PayloadAction<T>
) => {
  return async (dispatch: any): Promise<T | undefined> => {
    dispatch(setLoading(true));
    try {
      const result = await operation();
      if (successAction) {
        dispatch(successAction(result));
      }
      dispatch(setError(null));
      return result;
    } catch (error) {
      dispatch(setError((error as Error).message || 'Operation failed'));
      return undefined;
    } finally {
      dispatch(setLoading(false));
    }
  };
};
