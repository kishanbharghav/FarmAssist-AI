import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sprout, Droplets, Bug, TrendingUp, CloudRain, Wheat, Sun, Wind, MessageCircle } from "lucide-react";

interface SuggestionCloudsProps {
  onQuestionClick: (question: string) => void;
}

const SuggestionClouds = ({ onQuestionClick }: SuggestionCloudsProps) => {
  const suggestions = [
    { text: "Best crops for my climate?", icon: Sprout, color: "bg-green-500" },
    { text: "Watering schedule tips?", icon: Droplets, color: "bg-blue-500" },
    { text: "Natural pest control?", icon: Bug, color: "bg-orange-500" },
    { text: "Current crop prices?", icon: TrendingUp, color: "bg-purple-500" },
    { text: "Weather impact on farming?", icon: CloudRain, color: "bg-cyan-500" },
    { text: "Soil preparation guide?", icon: Wheat, color: "bg-amber-500" },
    { text: "Irrigation best practices?", icon: Sun, color: "bg-red-500" },
    { text: "Seasonal farming tips?", icon: Wind, color: "bg-teal-500" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Floating suggestion clouds */}
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        const positions = [
          { top: "15%", left: "10%", animation: "float-1" },
          { top: "25%", right: "15%", animation: "float-2" },
          { top: "40%", left: "5%", animation: "float-3" },
          { top: "60%", right: "10%", animation: "float-1" },
          { top: "35%", left: "20%", animation: "float-2" },
          { top: "70%", left: "15%", animation: "float-3" },
          { top: "20%", right: "25%", animation: "float-1" },
          { top: "50%", right: "20%", animation: "float-2" },
        ];
        
        const position = positions[index];
        
        return (
          <div
            key={index}
            className={`absolute pointer-events-auto`}
            style={{
              top: position.top,
              left: position.left,
              right: position.right,
              animation: `${position.animation} ${6 + index}s ease-in-out infinite`,
            }}
          >
            <Button
              variant="outline"
              className={`${suggestion.color} text-white border-white/30 hover:border-white/50 hover:scale-110 transition-all duration-300 rounded-full px-4 py-2 shadow-lg hover:shadow-xl backdrop-blur-sm bg-opacity-90 group`}
              onClick={() => onQuestionClick(suggestion.text)}
            >
              <Icon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{suggestion.text}</span>
              <MessageCircle className="h-3 w-3 ml-2 opacity-60 group-hover:opacity-100" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestionClouds;