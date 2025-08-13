import { useState, useCallback } from 'react';
import { translateText } from '@/services/translationService';

export type Language = 'en' | 'tamil' | 'hindi';

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = useCallback(async (text: string, targetLanguage: 'tamil' | 'hindi') => {
    if (!text.trim()) return text;
    
    setIsTranslating(true);
    try {
      const translatedText = await translateText(text, targetLanguage);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const switchLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
  }, []);

  return {
    currentLanguage,
    isTranslating,
    translate,
    switchLanguage
  };
};