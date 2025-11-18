/**
 * Q&A Constants
 * Categories and filter options for Q&A section
 */

import { CategoryInfo } from '../types/QnA';

export const QUESTION_CATEGORIES: CategoryInfo[] = [
  { id: 'feeding', title: 'Emzirme & Beslenme', icon: 'nutrition', color: '#22C55E' },
  { id: 'sleep', title: 'Uyku', icon: 'moon', color: '#8B5CF6' },
  { id: 'health', title: 'Sağlık', icon: 'medical', color: '#EF4444' },
  { id: 'development', title: 'Gelişim', icon: 'trending-up', color: '#3B82F6' },
  { id: 'nutrition', title: 'Beslenme', icon: 'restaurant', color: '#F97316' },
  { id: 'care', title: 'Bakım', icon: 'heart', color: '#EC4899' },
  { id: 'behavior', title: 'Davranış', icon: 'people', color: '#10B981' },
  { id: 'other', title: 'Diğer', icon: 'ellipsis-horizontal', color: '#6B7280' },
];

export const FILTER_OPTIONS = [
  { id: 'all', title: 'Tümü' },
  { id: 'new', title: 'Yeni' },
  { id: 'popular', title: 'Popüler' },
  { id: 'mine', title: 'Benim Sorularım' },
] as const;
