/**
 * Q&A Types for DostAnne
 * Types for Question and Answer functionality
 */

export interface Answer {
  id: string;
  questionId: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  isAccepted?: boolean;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  category: QuestionCategory;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  views: number;
  answerCount: number;
  likes: number;
  isResolved: boolean;
  answers?: Answer[];
}

export type QuestionCategory = 
  | 'feeding'
  | 'sleep'
  | 'health'
  | 'development'
  | 'nutrition'
  | 'care'
  | 'behavior'
  | 'other';

export type QuestionFilter = 'all' | 'new' | 'popular' | 'mine';

export interface CategoryInfo {
  id: QuestionCategory;
  title: string;
  icon: string;
  color: string;
}
