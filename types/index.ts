// User Form Data
export interface UserFormData {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number;
  weight: number;
  goal: 'Weight Loss' | 'Muscle Gain' | 'Maintenance' | 'Athletic Performance' | 'General Fitness';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  location: 'Home' | 'Gym' | 'Outdoor' | 'Hybrid';
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Keto' | 'Paleo' | 'Mediterranean';
  medical?: string;
  stress?: 'Low' | 'Moderate' | 'High';
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GeneratePlanResponse {
  success: boolean;
  plan: string;
  userData: UserFormData;
  timestamp: string;
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl: string;
}

export interface ImageData {
  url: string;
  title: string;
}

// Saved Plan Data
export interface SavedPlanData {
  plan: string;
  userData: UserFormData;
  timestamp: string;
}

// Form Errors
export interface FormErrors {
  [key: string]: string;
}

// Voice Options
export type VoiceOption = 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'fable' | 'nova' | 'onyx' | 'sage' | 'shimmer';

// Audio Section Type
export type AudioSection = 'workout' | 'diet' | null;
