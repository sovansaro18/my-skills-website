export enum AppView {
  DASHBOARD = 'dashboard',
  COURSE_DETAIL = 'course_detail',
  LESSON = 'lesson',
  QUIZ = 'quiz',
  SHORTCUTS = 'shortcuts',
  EXERCISES = 'exercises',
  LOGIN = 'login',
  REGISTER = 'register',
  PROFILE = 'PROFILE',
  ABOUT = 'ABOUT',
  SAVED = 'SAVED',
}

export interface SavedLesson {
  courseId: string;
  moduleId: string;
  lessonId: string;
  title: string;
  savedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'teacher' | 'admin';
  
  savedLessons?: SavedLesson[];

  progress?: {
    completedLessons: Array<{
      lessonId: string;
      completedAt: Date;
    }>;
    quizScores: Array<{
      quizId: string;
      score: number;
      total: number;
      percentage: number;
      date: Date;
    }>;
    lastViewed?: {
      courseId: string;
      moduleId: string;
      lessonId: string;
      timestamp: Date;
    };
  };
  createdAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  imageUrl: string;
  color: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  durationMinutes: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}