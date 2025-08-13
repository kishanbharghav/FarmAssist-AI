import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Languages, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { translateText } from '@/services/translationService';

interface TranslateButtonProps {
  text: string;
  onTranslate: (translatedText: string, language: 'tamil' | 'hindi') => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

const TranslateButton = ({ 
  text, 
  onTranslate, 
  className,
  variant = 'ghost',
  size = 'sm'
}: TranslateButtonProps) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleTranslate = async (language: 'tamil' | 'hindi') => {
    if (!text.trim()) return;
    
    setIsTranslating(true);
    setShowOptions(false);
    
    try {
      const translatedText = await translateText(text, language);
      onTranslate(translatedText, language);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  if (showOptions) {
    return (
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTranslate('tamil')}
          disabled={isTranslating}
          className="text-xs px-2 py-1 h-6 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
        >
          தமிழ்
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTranslate('hindi')}
          disabled={isTranslating}
          className="text-xs px-2 py-1 h-6 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
        >
          हिंदी
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowOptions(false)}
          className="text-xs px-2 py-1 h-6"
        >
          ✕
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setShowOptions(true)}
      disabled={isTranslating || !text.trim()}
      className={cn(
        "transition-all duration-200 hover:scale-105",
        className
      )}
    >
      {isTranslating ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Languages className="h-3 w-3" />
      )}
      {size !== 'sm' && <span className="ml-1">Translate</span>}
    </Button>
  );
};

export default TranslateButton;