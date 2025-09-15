/**
 * Utility functions for language handling and display
 */

export const capitalizeLanguage = (lang: string): string => {
  const languageMap: Record<string, string> = {
    'korean': 'Korean',
    'japanese': 'Japanese',
    'spanish': 'Spanish',
    'french': 'French',
    'german': 'German',
    'italian': 'Italian',
    'portuguese': 'Portuguese',
    'chinese': 'Chinese (Mandarin)',
    'arabic': 'Arabic',
    'other': 'Other'
  };
  return languageMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
};

export const replaceTargetLanguagePlaceholder = (
  text: string, 
  selectedLanguage?: string,
  customLanguage?: string
): string => {
  let displayLanguage = 'your target language';
  
  if (selectedLanguage === 'other' && customLanguage) {
    displayLanguage = customLanguage;
  } else if (selectedLanguage) {
    displayLanguage = capitalizeLanguage(selectedLanguage);
  }
  
  return text.replace('[Target Language]', displayLanguage);
};

export const replaceLanguageSpecificText = (
  text: string, 
  selectedLanguage?: string,
  customLanguage?: string
): string => {
  let processedText = text;
  
  // Replace [Target Language] placeholder for general use
  processedText = replaceTargetLanguagePlaceholder(processedText, selectedLanguage, customLanguage);
  
  // Handle specific case for "native speaker friends" text
  if (processedText.includes('[Target Language] native speaker friends')) {
    if (selectedLanguage === 'other') {
      // For "other" languages, use generic "native speaker friends"
      processedText = processedText.replace('[Target Language] native speaker friends', 'native speaker friends');
    } else if (selectedLanguage) {
      // For specific languages, use the language name
      const languageName = capitalizeLanguage(selectedLanguage);
      processedText = processedText.replace('[Target Language] native speaker friends', `${languageName} friends`);
    } else {
      processedText = processedText.replace('[Target Language] native speaker friends', 'native speaker friends');
    }
  }
  
  return processedText;
};