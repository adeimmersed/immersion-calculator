/**
 * Database integration utilities
 * Supports multiple database providers
 */

import { createClient } from '@supabase/supabase-js';

export interface AssessmentRecord {
  id?: string;
  email: string;
  user_name?: string;
  selected_language?: string;
  custom_language?: string;
  intensity_level?: number;
  learner_profile?: string;
  time_commitment?: string;
  assessment_date?: string;
  completion_time?: number;
  responses: any;
  results: any;
  created_at?: string;
  
  // Individual question responses for detailed analysis
  q1_name?: string;
  q2_language_selection?: any;
  q3_motivation?: any;
  q4_speaking_priority?: string;
  q5_capability_level?: string;
  q6_time_commitment?: number;
  q7_lifestyle?: string;
  q8_learning_style?: string; // Maps to content-consumption
  q9_current_method?: string;
  q10_immersion_experience?: string; // Maps to vocabulary-system
  q11_accent_priority?: string;
  q12_goals?: any; // Maps to timeline-expectations
  q13_challenges?: any; // Maps to learning-obstacles
  q14_preferences?: any; // Maps to communication-preference
}

// Database provider type
export type DatabaseProvider = 'supabase' | 'firebase' | 'mongodb' | 'local';

// Get current database provider
export const getDatabaseProvider = (): DatabaseProvider => {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) return 'supabase';
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return 'firebase';
  if (process.env.MONGODB_URI) return 'mongodb';
  return 'local';
};

// Store assessment data
export const storeAssessmentInDatabase = async (data: AssessmentRecord): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const provider = getDatabaseProvider();
    
    switch (provider) {
      case 'supabase':
        const id = await storeInSupabase(data);
        return { success: true, id };
      case 'firebase':
        const firebaseId = await storeInFirebase(data);
        return { success: true, id: firebaseId };
      case 'mongodb':
        const mongoId = await storeInMongoDB(data);
        return { success: true, id: mongoId };
      default:
        const localId = await storeInLocalStorage(data);
        return { success: true, id: localId };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get all assessments
export const getAllAssessments = async (): Promise<AssessmentRecord[]> => {
  const provider = getDatabaseProvider();
  
  switch (provider) {
    case 'supabase':
      return await getFromSupabase();
    case 'firebase':
      return await getFromFirebase();
    case 'mongodb':
      return await getFromMongoDB();
    default:
      return getFromLocalStorage();
  }
};

// Supabase integration
const storeInSupabase = async (data: AssessmentRecord): Promise<string> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: result, error } = await supabase
    .from('assessments')
    .insert([{
      email: data.email,
      user_name: data.user_name,
      selected_language: data.selected_language,
      custom_language: data.custom_language,
      intensity_level: data.intensity_level,
      learner_profile: data.learner_profile,
      time_commitment: data.time_commitment,
      assessment_date: data.assessment_date || new Date().toISOString(),
      completion_time: data.completion_time,
      responses: data.responses,
      results: data.results,
      
      // Individual question responses
      q1_name: data.q1_name,
      q2_language_selection: data.q2_language_selection,
      q3_motivation: data.q3_motivation,
      q4_speaking_priority: data.q4_speaking_priority,
      q5_capability_level: data.q5_capability_level,
      q6_time_commitment: data.q6_time_commitment,
      q7_lifestyle: data.q7_lifestyle,
      q8_learning_style: data.q8_learning_style,
      q9_current_method: data.q9_current_method,
      q10_immersion_experience: data.q10_immersion_experience,
      q11_accent_priority: data.q11_accent_priority,
      q12_goals: data.q12_goals,
      q13_challenges: data.q13_challenges,
      q14_preferences: data.q14_preferences
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Supabase error:', error);
    throw new Error(`Supabase error: ${error.message}`);
  }
  
  return result.id;
};

const getFromSupabase = async (): Promise<AssessmentRecord[]> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Supabase error:', error);
    throw new Error(`Supabase error: ${error.message}`);
  }
  
  return data || [];
};

// Firebase integration
const storeInFirebase = async (data: AssessmentRecord): Promise<string> => {
  // This would be implemented when Firebase is set up
  throw new Error('Firebase integration not implemented yet');
};

const getFromFirebase = async (): Promise<AssessmentRecord[]> => {
  // This would be implemented when Firebase is set up
  throw new Error('Firebase integration not implemented yet');
};

// MongoDB integration
const storeInMongoDB = async (data: AssessmentRecord): Promise<string> => {
  // This would be implemented when MongoDB is set up
  throw new Error('MongoDB integration not implemented yet');
};

const getFromMongoDB = async (): Promise<AssessmentRecord[]> => {
  // This would be implemented when MongoDB is set up
  throw new Error('MongoDB integration not implemented yet');
};

// Local storage (current implementation)
const storeInLocalStorage = async (data: AssessmentRecord): Promise<string> => {
  const id = `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem(id, JSON.stringify(data));
  return id;
};

const getFromLocalStorage = (): AssessmentRecord[] => {
  const assessments: AssessmentRecord[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('assessment_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        assessments.push({ ...data, id: key });
      } catch (error) {
        console.error(`Error parsing assessment data for key ${key}:`, error);
      }
    }
  }
  
  return assessments.sort((a, b) => 
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
};

// Export current data for migration
export const exportCurrentData = (): string => {
  const data = getFromLocalStorage();
  return JSON.stringify(data, null, 2);
};

// Import data from export
export const importData = (jsonData: string): void => {
  try {
    const data = JSON.parse(jsonData);
    if (Array.isArray(data)) {
      data.forEach(assessment => {
        if (assessment.id) {
          localStorage.setItem(assessment.id, JSON.stringify(assessment));
        }
      });
    }
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Invalid data format');
  }
};
