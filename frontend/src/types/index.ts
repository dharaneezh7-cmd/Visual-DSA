export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface LearningProgress {
  _id: string;
  userId: string;
  topic: string;
  concept: string;
  completed: boolean;
  completionPercentage: number;
  timeSpent: number;
  operationsPerformed: number;
  lastAccessed: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  userId: string;
  topic: string;
  activityType: string;
  operation: string;
  result: string;
  duration: number;
  timestamp: string;
}

export interface Practice {
  _id: string;
  userId: string;
  topic: string;
  questionId: string;
  answer: string;
  correct: boolean;
  attempts: number;
  timestamp: string;
}

export interface DashboardData {
  overallProgress: number;
  topicsCompleted: number;
  totalTopics: number;
  practiceAccuracy: number;
  learningTime: string;
  strongTopics: string[];
  weakTopics: string[];
  recommendedTopics: string[];
  learningLevel: string;
  perTopicAnalysis?: {
    topic: string;
    sectionsCompleted: number;
    completion: number;
    practiceAccuracy: number;
    timeSpent: number;
  }[];
  insight?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
}

export interface Step {
  step: number;
  description: string;
  highlight?: number[];
  code?: string;
}

export interface OperationResult {
  success: boolean;
  message: string;
  steps: Step[];
  complexity: string;
  state: number[];
}

export interface ArrayElement {
  value: number;
  state: 'default' | 'highlight' | 'comparing' | 'swapping' | 'sorted' | 'inserting' | 'found';
}

export interface ListNode {
  id: number;
  value: number;
  state: 'default' | 'highlight' | 'comparing' | 'inserting' | 'deleting' | 'found' | 'traversing';
  next: number | null;
}

export interface StackElement {
  value: number;
  state: 'default' | 'highlight' | 'pushing' | 'popping' | 'peeking';
}

export interface QueueElement {
  value: number;
  state: 'default' | 'highlight' | 'enqueuing' | 'dequeuing' | 'front' | 'rear';
}

export interface CircularQueueElement {
  value: number | null;
  state: 'default' | 'highlight' | 'enqueuing' | 'dequeuing' | 'front' | 'rear' | 'empty';
}
