import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sprout, Droplets, Bug, TrendingUp, CloudRain, Wheat, Sun, Wind } from "lucide-react";

interface SuggestionBarProps {
  onQuestionClick: (question: string) => void;
}

const SuggestionBar = ({ onQuestionClick }: SuggestionBarProps) => {
  const suggestions = [
    { text: "Best crops for my climate?", icon: Sprout, color: "bg-green-500 hover:bg-green-600" },
    { text: "Watering schedule tips?", icon: Droplets, color: "bg-blue-500 hover:bg-blue-600" },
    { text: "Natural pest control?", icon: Bug, color: "bg-orange-500 hover:bg-orange-600" },
    { text: "Current crop prices?", icon: TrendingUp, color: "bg-purple-500 hover:bg-purple-600" },
    { text: "Weather impact on farming?", icon: CloudRain, color: "bg-cyan-500 hover:bg-cyan-600" },
    { text: "Soil preparation guide?", icon: Wheat, color: "bg-amber-500 hover:bg-amber-600" },
    { text: "Irrigation best practices?", icon: Sun, color: "bg-red-500 hover:bg-red-600" },
    { text: "Seasonal farming tips?", icon: Wind, color: "bg-teal-500 hover:bg-teal-600" },
    { text: "Crop rotation benefits?", icon: Sprout, color: "bg-indigo-500 hover:bg-indigo-600" },
    { text: "Fertilizer recommendations?", icon: Wheat, color: "bg-pink-500 hover:bg-pink-600" },
  ];

  return (
    <div className="border-t border-border/50 bg-muted/30 backdrop-blur-sm">
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Quick Questions:</p>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-2">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`${suggestion.color} text-white border-white/30 hover:border-white/50 transition-all duration-200 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap shadow-sm hover:shadow-md hover:scale-105 flex-shrink-0`}
                  onClick={() => onQuestionClick(suggestion.text)}
                >
                  <Icon className="h-3 w-3 mr-1.5" />
                  {suggestion.text}
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default SuggestionBar;