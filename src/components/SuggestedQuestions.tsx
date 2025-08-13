import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Droplets, Bug, TrendingUp, CloudRain, Wheat } from "lucide-react";

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const SuggestedQuestions = ({ onQuestionClick }: SuggestedQuestionsProps) => {
  const questions = [
    {
      icon: Sprout,
      text: "What crops should I plant this season?",
      category: "Planting",
      gradient: "bg-[var(--gradient-primary)]"
    },
    {
      icon: Droplets,
      text: "How often should I water my tomatoes?",
      category: "Irrigation",
      gradient: "bg-[var(--gradient-weather)]"
    },
    {
      icon: Bug,
      text: "How do I deal with pest problems naturally?",
      category: "Pest Control",
      gradient: "bg-[var(--gradient-secondary)]"
    },
    {
      icon: TrendingUp,
      text: "What are the current market prices for crops?",
      category: "Market",
      gradient: "bg-[var(--gradient-earth)]"
    },
    {
      icon: CloudRain,
      text: "How does weather affect my crop yield?",
      category: "Weather",
      gradient: "bg-gradient-to-br from-blue-400 to-purple-500"
    },
    {
      icon: Wheat,
      text: "What's the best soil preparation method?",
      category: "Soil Health",
      gradient: "bg-gradient-to-br from-amber-400 to-orange-500"
    }
  ];

  return (
    <Card className="border-2 border-primary/20 shadow-[var(--shadow-medium)] bg-gradient-to-br from-forest-green-light to-golden-wheat-light">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary text-lg">
          <Sprout className="h-5 w-5" />
          Quick Questions to Get Started
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click on any question below to get expert farming advice
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {questions.map((question, index) => {
            const Icon = question.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className={`${question.gradient} text-white border-white/30 hover:border-white/50 hover:scale-105 transition-all duration-200 h-auto p-4 flex flex-col items-start gap-2 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)]`}
                onClick={() => onQuestionClick(question.text)}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {question.category}
                  </span>
                </div>
                <p className="text-left text-sm font-medium leading-relaxed">
                  {question.text}
                </p>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-primary font-medium">
            💡 Tip: Be specific about your location, crop type, and farming conditions for the most accurate advice!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestedQuestions;