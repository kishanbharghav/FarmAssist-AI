export interface TranslationService {
  translateText: (text: string, targetLanguage: 'tamil' | 'hindi') => Promise<string>;
}

// Simple translation maps for common farming terms and phrases
const tamilTranslations: Record<string, string> = {
  // Basic farming terms
  "farming": "விவசாயம்",
  "crop": "பயிர்",
  "crops": "பயிர்கள்",
  "weather": "வானிலை", 
  "soil": "மண்",
  "water": "நீர்",
  "irrigation": "நீர்ப்பாசனம்",
  "pest": "பூச்சி",
  "fertilizer": "உரம்",
  "seeds": "விதைகள்",
  "harvest": "அறுவடை",
  "planting": "நடவு",
  "rice": "நெல்",
  "wheat": "கோதுமை",
  "corn": "சோளம்",
  "tomatoes": "தக்காளி",
  "potatoes": "உருளைக்கிழங்கு",
  "onions": "வெங்காயம்",
  "sugarcane": "கரும்பு",
  "cotton": "பருத்தி",
  "turmeric": "மஞ்சள்",
  "chickpeas": "கொண்டைக்கடலை",
  
  // Common phrases
  "What crops should I plant this season?": "இந்த பருவத்தில் நான் எந்த பயிர்களை நடவு செய்ய வேண்டும்?",
  "How often should I water my tomatoes?": "என் தக்காளிக்கு எவ்வளவு அடிக்கடி நீர் கொடுக்க வேண்டும்?",
  "How do I deal with pest problems naturally?": "பூச்சி பிரச்சனைகளை இயற்கையாக எப்படி சமாளிப்பது?",
  "What are the current market prices for crops?": "பயிர்களுக்கான தற்போதைய சந்தை விலைகள் என்ன?",
  "How does weather affect my crop yield?": "வானிலை என் பயிர் விளைச்சலை எப்படி பாதிக்கிறது?",
  "What's the best soil preparation method?": "சிறந்த மண் தயாரிப்பு முறை என்ன?",
  "Quick Questions to Get Started": "தொடங்குவதற்கான விரைவான கேள்விகள்",
  "Translate to Tamil": "தமிழில் மொழிபெயர்க்கவும்",
  "Translate to Hindi": "हिंदी में अनुवाद करें",
};

const hindiTranslations: Record<string, string> = {
  // Basic farming terms
  "farming": "कृषि",
  "crop": "फसल",
  "crops": "फसलें",
  "weather": "मौसम",
  "soil": "मिट्टी", 
  "water": "पानी",
  "irrigation": "सिंचाई",
  "pest": "कीट",
  "fertilizer": "उर्वरक",
  "seeds": "बीज",
  "harvest": "फसल कटाई",
  "planting": "बुआई",
  "rice": "चावल",
  "wheat": "गेहूं",
  "corn": "मक्का",
  "tomatoes": "टमाटर",
  "potatoes": "आलू",
  "onions": "प्याज",
  "sugarcane": "गन्ना",
  "cotton": "कपास",
  "turmeric": "हल्दी",
  "chickpeas": "चना",
  
  // Common phrases
  "What crops should I plant this season?": "इस सीजन में मुझे कौन सी फसलें लगानी चाहिए?",
  "How often should I water my tomatoes?": "मुझे अपने टमाटरों को कितनी बार पानी देना चाहिए?",
  "How do I deal with pest problems naturally?": "कीट समस्याओं से प्राकृतिक रूप से कैसे निपटूं?",
  "What are the current market prices for crops?": "फसलों के वर्तमान बाजार भाव क्या हैं?",
  "How does weather affect my crop yield?": "मौसम मेरी फसल की पैदावार को कैसे प्रभावित करता है?",
  "What's the best soil preparation method?": "मिट्टी तैयार करने का सबसे अच्छा तरीका क्या है?",
  "Quick Questions to Get Started": "शुरू करने के लिए त्वरित प्रश्न",
  "Translate to Tamil": "तमिल में अनुवाद करें",
  "Translate to Hindi": "हिंदी में अनुवाद करें",
};

export const translateText = async (text: string, targetLanguage: 'tamil' | 'hindi'): Promise<string> => {
  const translations = targetLanguage === 'tamil' ? tamilTranslations : hindiTranslations;
  
  // Try exact match first
  if (translations[text]) {
    return translations[text];
  }
  
  // Try to translate word by word for longer texts
  let translatedText = text;
  Object.entries(translations).forEach(([english, translated]) => {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translatedText = translatedText.replace(regex, translated);
  });
  
  return translatedText;
};

export const getAvailableLanguages = () => {
  return [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tamil', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' }
  ];
};