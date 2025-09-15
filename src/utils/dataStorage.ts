export interface AssessmentData {
  id: string;
  email: string;
  responses: any;
  results: any;
  timestamp: string;
  subscriberId?: string;
}

export interface PersonalizedEmailData {
  email: string;
  userName: string;
  learnerProfile: string;
  intensityLevel: number;
  timeCommitment: number;
  selectedLanguage: string;
  motivation: string[];
  personalizedInsights: string[];
  nextSteps: string[];
  recommendations: string[];
}

// Simple in-memory storage (replace with database in production)
let assessmentData: AssessmentData[] = [];

export const storeAssessmentData = (data: Omit<AssessmentData, 'id'>): string => {
  const id = Math.random().toString(36).substr(2, 9);
  const newData = { ...data, id };
  assessmentData.push(newData);
  
  // Also store in localStorage for persistence
  try {
    const existingData = JSON.parse(localStorage.getItem('assessmentData') || '[]');
    existingData.push(newData);
    localStorage.setItem('assessmentData', JSON.stringify(existingData));
  } catch (error) {
    console.error('Error storing to localStorage:', error);
  }
  
  console.log('Stored assessment data:', newData);
  return id;
};

export const getAssessmentData = (): AssessmentData[] => {
  // Try to load from localStorage first
  try {
    const storedData = localStorage.getItem('assessmentData');
    if (storedData) {
      assessmentData = JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  
  return assessmentData;
};

export const getAssessmentDataByEmail = (email: string): AssessmentData | undefined => {
  const data = getAssessmentData();
  return data.find(item => item.email === email);
};

export const getAssessmentDataByProfile = (profileId: string): AssessmentData[] => {
  const data = getAssessmentData();
  return data.filter(item => item.results?.learnerProfile?.id === profileId);
};

export const getAssessmentDataByLanguage = (language: string): AssessmentData[] => {
  const data = getAssessmentData();
  return data.filter(item => 
    item.responses?.['language-selection']?.language === language
  );
};

export const getAssessmentDataByIntensityLevel = (minLevel: number, maxLevel?: number): AssessmentData[] => {
  const data = getAssessmentData();
  return data.filter(item => {
    const intensity = item.results?.intensityLevel || 0;
    if (maxLevel) {
      return intensity >= minLevel && intensity <= maxLevel;
    }
    return intensity >= minLevel;
  });
};

export const generatePersonalizedEmailData = (assessment: AssessmentData): PersonalizedEmailData => {
  const { email, responses, results } = assessment;
  
  return {
    email,
    userName: responses?.userName || 'there',
    learnerProfile: results?.learnerProfile?.title || 'Unknown',
    intensityLevel: results?.intensityLevel || 0,
    timeCommitment: results?.timeAllocation?.totalTime || 0,
    selectedLanguage: responses?.['language-selection']?.language || 'unknown',
    motivation: Array.isArray(responses?.motivation) ? responses.motivation : [],
    personalizedInsights: results?.personalizedInsights || [],
    nextSteps: results?.nextSteps || [],
    recommendations: results?.recommendations || []
  };
};

export const getEmailSegments = () => {
  const data = getAssessmentData();
  
  const segments = {
    byProfile: {} as Record<string, AssessmentData[]>,
    byLanguage: {} as Record<string, AssessmentData[]>,
    byIntensity: {
      low: [] as AssessmentData[],      // 1-3
      medium: [] as AssessmentData[],   // 4-6
      high: [] as AssessmentData[]      // 7-9
    },
    byTimeCommitment: {
      minimal: [] as AssessmentData[],  // < 60 min
      moderate: [] as AssessmentData[], // 60-120 min
      high: [] as AssessmentData[]      // > 120 min
    }
  };
  
  data.forEach(assessment => {
    const profile = assessment.results?.learnerProfile?.id || 'unknown';
    const language = assessment.responses?.['language-selection']?.language || 'unknown';
    const intensity = assessment.results?.intensityLevel || 0;
    const timeCommitment = assessment.results?.timeAllocation?.totalTime || 0;
    
    // Profile segments
    if (!segments.byProfile[profile]) {
      segments.byProfile[profile] = [];
    }
    segments.byProfile[profile].push(assessment);
    
    // Language segments
    if (!segments.byLanguage[language]) {
      segments.byLanguage[language] = [];
    }
    segments.byLanguage[language].push(assessment);
    
    // Intensity segments
    if (intensity <= 3) {
      segments.byIntensity.low.push(assessment);
    } else if (intensity <= 6) {
      segments.byIntensity.medium.push(assessment);
    } else {
      segments.byIntensity.high.push(assessment);
    }
    
    // Time commitment segments
    if (timeCommitment < 60) {
      segments.byTimeCommitment.minimal.push(assessment);
    } else if (timeCommitment <= 120) {
      segments.byTimeCommitment.moderate.push(assessment);
    } else {
      segments.byTimeCommitment.high.push(assessment);
    }
  });
  
  return segments;
};

export const clearAssessmentData = () => {
  assessmentData = [];
  localStorage.removeItem('assessmentData');
  console.log('Assessment data cleared');
};
