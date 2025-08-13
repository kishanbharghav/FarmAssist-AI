import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Sprout, Wheat, Tractor, Send, User, Bot, ArrowRight, Cloud, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import heroImage from "@/assets/farming-hero.jpg";
import ApiKeyForm from "./ApiKeyForm";
import { WeatherService, getCropPrices } from "@/services/weatherService";
import { checkCropCompatibility, getRecommendedCrops, CompatibilityResult } from "@/services/cropCompatibility";


interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface FarmerProfile {
  name: string;
  farmSize: string;
  cropTypes: string[];
  location: string;
  mainChallenges: string[];
  experience: string;
  soilType: string;
  plantingDate: string;
  irrigationType: string;
}

const FARMING_RESPONSES = {
  crops: {
    wheat: "Wheat farming requires proper soil preparation and timing. Consider soil testing for optimal fertilizer application. Plant in early spring for best yields.",
    corn: "Corn benefits from nitrogen-rich soil. Monitor for pests like corn borers. Ensure adequate spacing between plants for maximum growth.",
    tomatoes: "Tomatoes need well-drained soil and consistent watering. Use stakes or cages for support. Watch for blight and other diseases.",
    default: "Consider crop rotation to maintain soil health. Each crop has specific nutrient requirements and growing seasons."
  },
  pest: "Integrated Pest Management (IPM) is recommended. Use beneficial insects, crop rotation, and targeted treatments only when necessary.",
  weather: "Monitor weather forecasts closely. Consider drought-resistant varieties if water is limited. Proper drainage is crucial during heavy rains.",
  soil: "Regular soil testing is essential. Maintain proper pH levels and organic matter content. Consider cover crops to improve soil health.",
  market: "Diversify your crops to reduce market risk. Stay informed about commodity prices and consider direct-to-consumer sales for better margins.",
  default: "Farming success comes from careful planning, soil management, and adapting to local conditions. Consider consulting with local agricultural extension services."
};

export default function FarmingChatbot() {
  const [currentStep, setCurrentStep] = useState<"apikey" | "welcome" | "questionnaire" | "chat">("apikey");
  const [questionnaireStep, setQuestionnaireStep] = useState(0);
  const [farmerProfile, setFarmerProfile] = useState<Partial<FarmerProfile>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [openrouterApiKey, setOpenrouterApiKey] = useState("");
  const [openweatherApiKey, setOpenweatherApiKey] = useState("");
  const [weatherService, setWeatherService] = useState<WeatherService | null>(null);
  const [cropCompatibility, setCropCompatibility] = useState<CompatibilityResult[]>([]);
  const [lastUserMessage, setLastUserMessage] = useState("");
  const [awaitingDetailResponse, setAwaitingDetailResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questionnaireQuestions = [
    {
      id: "name",
      question: "What's your name?",
      type: "text",
      placeholder: "Enter your name"
    },
    {
      id: "farmSize",
      question: "What's the size of your farm?",
      type: "radio",
      options: ["Small (< 10 acres)", "Medium (10-100 acres)", "Large (100+ acres)"]
    },
    {
      id: "cropTypes",
      question: "What crops do you grow?",
      type: "checkbox",
      options: ["Wheat", "Corn", "Tomatoes", "Potatoes", "Soybeans", "Rice", "Other vegetables"]
    },
    {
      id: "location",
      question: "Where is your farm located?",
      type: "text",
      placeholder: "Enter your location (city, state/country)"
    },
    {
      id: "experience",
      question: "How long have you been farming?",
      type: "radio",
      options: ["New farmer (< 2 years)", "Experienced (2-10 years)", "Veteran (10+ years)"]
    },
    {
      id: "mainChallenges",
      question: "What are your main farming challenges?",
      type: "checkbox",
      options: ["Pest control", "Weather conditions", "Soil quality", "Market prices", "Water management", "Equipment"]
    },
    {
      id: "soilType",
      question: "What type of soil do you have?",
      type: "radio",
      options: ["Clay soil", "Sandy soil", "Loamy soil", "Silty soil", "Rocky soil", "Not sure"]
    },
    {
      id: "plantingDate",
      question: "When do you typically plant your crops?",
      type: "text",
      placeholder: "e.g., March-April, depends on monsoon, etc."
    },
    {
      id: "irrigationType",
      question: "What type of irrigation do you use?",
      type: "radio",
      options: ["Drip irrigation", "Sprinkler system", "Flood irrigation", "Rain-fed only", "Mixed methods", "No irrigation system"]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check for saved API keys on component mount
    const savedOpenrouterKey = localStorage.getItem('openrouter_api_key');
    const savedOpenweatherKey = localStorage.getItem('openweather_api_key');
    
    if (savedOpenrouterKey && savedOpenweatherKey) {
      setOpenrouterApiKey(savedOpenrouterKey);
      setOpenweatherApiKey(savedOpenweatherKey);
      setWeatherService(new WeatherService(savedOpenweatherKey));
      setCurrentStep("welcome");
    }
  }, []);

  const generateAIResponse = async (userMessage: string, profile: Partial<FarmerProfile>) => {
    setIsLoading(true);
    
    try {
      // Get live weather data and crop prices
      let weatherData = '';
      let cropPricesData = '';
      
      if (weatherService && profile.location) {
        try {
          const currentWeather = await weatherService.getCurrentWeather(profile.location);
          const forecast = await weatherService.getForecast(profile.location);
          
          weatherData = `\n\nLIVE WEATHER DATA:
Current conditions in ${currentWeather.location}:
- Temperature: ${currentWeather.temperature}°C
- Conditions: ${currentWeather.description}
- Humidity: ${currentWeather.humidity}%
- Wind: ${currentWeather.windSpeed} m/s
- Precipitation: ${currentWeather.precipitation}mm

5-Day Forecast:
${forecast.map(day => `${day.date}: ${day.temperature.min}-${day.temperature.max}°C, ${day.description}, Rain: ${day.precipitation}mm`).join('\n')}`;
        } catch (error) {
          weatherData = '\n\nWeather data temporarily unavailable.';
        }
      }
      
      const cropPrices = getCropPrices();
      cropPricesData = `\n\nCURRENT CROP PRICES:
${cropPrices.map(crop => `${crop.crop}: $${crop.price} ${crop.unit} (${crop.trend === 'up' ? '↗' : crop.trend === 'down' ? '↘' : '→'} ${crop.change > 0 ? '+' : ''}${crop.change}%)`).join('\n')}`;
      
      const systemPrompt = `You are an expert AI farming assistant. Provide CONCISE, practical answers (max 2-3 sentences). Focus on the most important advice first.

Farmer Profile:
- Name: ${profile.name || 'Unknown'}
- Farm Size: ${profile.farmSize || 'Unknown'}
- Location: ${profile.location || 'Unknown'}
- Experience: ${profile.experience || 'Unknown'}
- Crops: ${profile.cropTypes?.join(', ') || 'Various'}
- Main Challenges: ${profile.mainChallenges?.join(', ') || 'General farming'}
- Soil Type: ${profile.soilType || 'Unknown'}
- Planting Season: ${profile.plantingDate || 'Unknown'}
- Irrigation Method: ${profile.irrigationType || 'Unknown'}
${weatherData}
${cropPricesData}

Give a SHORT, direct answer. End with: "Would you like more detailed information about this topic?"

IMPORTANT: Keep responses under 100 words. Be helpful but brief.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Farming Assistant',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b:free',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      let aiResponse = data.choices[0]?.message?.content || "I apologize, but I was unable to generate a response. Could you please try rephrasing your question?";
      
      // Remove markdown formatting
      aiResponse = aiResponse.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove **bold**
      aiResponse = aiResponse.replace(/\*(.*?)\*/g, '$1'); // Remove *italic*
      aiResponse = aiResponse.replace(/__(.*?)__/g, '$1'); // Remove __underline__
      aiResponse = aiResponse.replace(/`(.*?)`/g, '$1'); // Remove `code`
      
      setIsLoading(false);
      return aiResponse;
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsLoading(false);
      
      // Fallback to basic responses if API fails
      const lowerMessage = userMessage.toLowerCase();
      let fallbackResponse = "";
      
      if (lowerMessage.includes("wheat") || lowerMessage.includes("grain")) {
        fallbackResponse = FARMING_RESPONSES.crops.wheat;
      } else if (lowerMessage.includes("corn") || lowerMessage.includes("maize")) {
        fallbackResponse = FARMING_RESPONSES.crops.corn;
      } else if (lowerMessage.includes("tomato")) {
        fallbackResponse = FARMING_RESPONSES.crops.tomatoes;
      } else if (lowerMessage.includes("pest") || lowerMessage.includes("bug") || lowerMessage.includes("insect")) {
        fallbackResponse = FARMING_RESPONSES.pest;
      } else if (lowerMessage.includes("weather") || lowerMessage.includes("rain") || lowerMessage.includes("drought")) {
        fallbackResponse = FARMING_RESPONSES.weather;
      } else if (lowerMessage.includes("soil") || lowerMessage.includes("fertilizer")) {
        fallbackResponse = FARMING_RESPONSES.soil;
      } else if (lowerMessage.includes("price") || lowerMessage.includes("market") || lowerMessage.includes("sell")) {
        fallbackResponse = FARMING_RESPONSES.market;
      } else {
        fallbackResponse = FARMING_RESPONSES.default;
      }
      
      return `I'm having trouble connecting to OpenRouter right now, but here's some basic advice: ${fallbackResponse}`;
    }
  };

  const handleApiKeySet = (apiKeys: { openrouter: string; openweather: string }) => {
    setOpenrouterApiKey(apiKeys.openrouter);
    setOpenweatherApiKey(apiKeys.openweather);
    setWeatherService(new WeatherService(apiKeys.openweather));
    
    localStorage.setItem('openrouter_api_key', apiKeys.openrouter);
    localStorage.setItem('openweather_api_key', apiKeys.openweather);
    setCurrentStep("welcome");
  };

  const generateDetailedResponse = async (originalMessage: string, profile: Partial<FarmerProfile>) => {
    setIsLoading(true);
    
    try {
      // Get detailed weather and pricing data
      let weatherData = '';
      let cropPricesData = '';
      
      if (weatherService && profile.location) {
        try {
          const currentWeather = await weatherService.getCurrentWeather(profile.location);
          const forecast = await weatherService.getForecast(profile.location);
          
          weatherData = `\n\nDETAILED WEATHER DATA:
Current conditions in ${currentWeather.location}:
- Temperature: ${currentWeather.temperature}°C
- Conditions: ${currentWeather.description}
- Humidity: ${currentWeather.humidity}%
- Wind: ${currentWeather.windSpeed} m/s
- Precipitation: ${currentWeather.precipitation}mm

5-Day Forecast:
${forecast.map(day => `${day.date}: ${day.temperature.min}-${day.temperature.max}°C, ${day.description}, Rain: ${day.precipitation}mm`).join('\n')}`;
        } catch (error) {
          weatherData = '\n\nWeather data temporarily unavailable.';
        }
      }
      
      const cropPrices = getCropPrices();
      cropPricesData = `\n\nDETAILED CROP PRICES:
${cropPrices.map(crop => `${crop.crop}: $${crop.price} ${crop.unit} (${crop.trend === 'up' ? '↗' : crop.trend === 'down' ? '↘' : '→'} ${crop.change > 0 ? '+' : ''}${crop.change}%)`).join('\n')}`;
      
      const detailedPrompt = `You are an expert AI farming assistant. Provide DETAILED, comprehensive information about: "${originalMessage}"

Farmer Profile:
- Name: ${profile.name || 'Unknown'}
- Location: ${profile.location || 'Unknown'}
- Crops: ${profile.cropTypes?.join(', ') || 'Various'}
- Soil Type: ${profile.soilType || 'Unknown'}
- Irrigation: ${profile.irrigationType || 'Unknown'}
${weatherData}
${cropPricesData}

Provide detailed explanations, step-by-step guidance, specific recommendations, and reference the weather/pricing data when relevant. Be thorough and educational.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Farming Assistant',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b:free',
          messages: [
            {
              role: 'system',
              content: detailedPrompt
            },
            {
              role: 'user',
              content: `Please provide detailed information about: ${originalMessage}`
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      let aiResponse = data.choices[0]?.message?.content || "I apologize, but I was unable to generate a detailed response.";
      
      // Remove markdown formatting
      aiResponse = aiResponse.replace(/\*\*(.*?)\*\*/g, '$1');
      aiResponse = aiResponse.replace(/\*(.*?)\*/g, '$1');
      aiResponse = aiResponse.replace(/__(.*?)__/g, '$1');
      aiResponse = aiResponse.replace(/`(.*?)`/g, '$1');
      
      setIsLoading(false);
      return aiResponse;
    } catch (error) {
      console.error('Error getting detailed response:', error);
      setIsLoading(false);
      return "I'm having trouble generating a detailed response right now. Please try again later.";
    }
  };

  const splitLongMessage = (message: string, maxLength: number = 300): string[] => {
    if (message.length <= maxLength) return [message];
    
    const sentences = message.split(/[.!?]+/).filter(s => s.trim());
    const chunks: string[] = [];
    let currentChunk = "";
    
    for (const sentence of sentences) {
      const sentenceWithPunctuation = sentence.trim() + ".";
      
      if ((currentChunk + sentenceWithPunctuation).length > maxLength && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentenceWithPunctuation;
      } else {
        currentChunk += (currentChunk ? " " : "") + sentenceWithPunctuation;
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks.length > 0 ? chunks : [message];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const trimmedMessage = inputMessage.trim();
    
    // Check if user is responding to "Would you like more detailed information?"
    if (awaitingDetailResponse) {
      if (trimmedMessage.toLowerCase().includes('yes') || trimmedMessage.toLowerCase().includes('sure') || trimmedMessage.toLowerCase().includes('please')) {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: trimmedMessage,
          sender: "user",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");
        setAwaitingDetailResponse(false);

        // Generate detailed response
        const detailedResponse = await generateDetailedResponse(lastUserMessage, farmerProfile);
        
        // Split detailed response if needed
        const messageParts = splitLongMessage(detailedResponse);
        
        messageParts.forEach((part, index) => {
          setTimeout(() => {
            const botMessage: Message = {
              id: `${Date.now()}_detailed_${index}`,
              content: part,
              sender: "bot",
              timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
          }, index * 800);
        });
        
        return;
      } else {
        // User said no, just acknowledge and reset
        const userMessage: Message = {
          id: Date.now().toString(),
          content: trimmedMessage,
          sender: "user",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");
        setAwaitingDetailResponse(false);

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Got it! Feel free to ask me anything else about farming.",
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLastUserMessage(trimmedMessage);

    const response = await generateAIResponse(trimmedMessage, farmerProfile);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: "bot",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    
    // Set flag to await detail response if the response asks for more info
    if (response.includes("Would you like more detailed information")) {
      setAwaitingDetailResponse(true);
    }
  };

  const handleQuestionnaireNext = () => {
    if (questionnaireStep < questionnaireQuestions.length - 1) {
      setQuestionnaireStep(questionnaireStep + 1);
    } else {
      setCurrentStep("chat");
      // Initialize chat with welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        content: `Hello ${farmerProfile.name || "there"}! I'm your AI farming assistant. I'm here to help you with any farming questions or challenges you might have. Based on your profile, I see you're working with ${farmerProfile.cropTypes?.join(", ") || "various crops"}. How can I assist you today?`,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const validateCropCompatibility = () => {
    if (!farmerProfile.cropTypes || !farmerProfile.soilType || !farmerProfile.irrigationType || !farmerProfile.location || !farmerProfile.plantingDate) {
      return;
    }

    const results = farmerProfile.cropTypes.map(crop => 
      checkCropCompatibility(
        crop,
        farmerProfile.soilType!,
        farmerProfile.irrigationType!,
        farmerProfile.location!,
        farmerProfile.plantingDate!
      )
    );

    setCropCompatibility(results);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFarmerProfile(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validate crop compatibility when relevant fields change
    if (['cropTypes', 'soilType', 'irrigationType', 'location', 'plantingDate'].includes(field)) {
      setTimeout(validateCropCompatibility, 100);
    }
  };

  const getSuggestionsBasedOnProfile = () => {
    const suggestions = [];
    
    if (farmerProfile.mainChallenges?.includes("Pest control")) {
      suggestions.push("🐛 Implement integrated pest management strategies");
    }
    if (farmerProfile.mainChallenges?.includes("Soil quality")) {
      suggestions.push("🌱 Consider soil testing and organic matter improvement");
    }
    if (farmerProfile.mainChallenges?.includes("Weather conditions")) {
      suggestions.push("🌤️ Look into drought-resistant crop varieties");
    }
    if (farmerProfile.mainChallenges?.includes("Market prices")) {
      suggestions.push("💰 Explore direct-to-consumer sales opportunities");
    }
    
    return suggestions;
  };

  if (currentStep === "apikey") {
    return <ApiKeyForm onApiKeySet={handleApiKeySet} />;
  }


  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-green-light via-background to-golden-wheat-light">
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Sprout className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-forest-green to-earth-brown bg-clip-text text-transparent">
                AI Farming Assistant
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Your intelligent companion for better farming decisions. Get personalized advice, 
                crop recommendations, and solutions to your farming challenges.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 border-primary/20 shadow-soft">
                <CardHeader>
                  <MessageCircle className="w-8 h-8 text-primary mx-auto" />
                  <CardTitle className="text-center">Smart Advice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Get AI-powered farming advice tailored to your specific crops and challenges
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary/20 shadow-soft">
                <CardHeader>
                  <Wheat className="w-8 h-8 text-primary mx-auto" />
                  <CardTitle className="text-center">Crop Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Learn best practices for planting, growing, and harvesting your crops
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary/20 shadow-soft">
                <CardHeader>
                  <Tractor className="w-8 h-8 text-primary mx-auto" />
                  <CardTitle className="text-center">Farm Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Optimize your farm operations for better productivity and profits
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Button
              variant="hero"
              size="xl"
              onClick={() => setCurrentStep("questionnaire")}
              className="mb-4"
            >
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Tell us about your farm to get personalized recommendations
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "questionnaire") {
    const currentQuestion = questionnaireQuestions[questionnaireStep];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-forest-green-light p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Tell Us About Your Farm</h2>
            <p className="text-muted-foreground">
              Step {questionnaireStep + 1} of {questionnaireQuestions.length}
            </p>
            <div className="w-full bg-secondary rounded-full h-2 mt-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((questionnaireStep + 1) / questionnaireQuestions.length) * 100}%` }}
              />
            </div>
          </div>
          
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.type === "text" && (
                <Input
                  placeholder={currentQuestion.placeholder}
                  value={farmerProfile[currentQuestion.id as keyof FarmerProfile] as string || ""}
                  onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                />
              )}
              
              {currentQuestion.type === "radio" && (
                <RadioGroup
                  value={farmerProfile[currentQuestion.id as keyof FarmerProfile] as string || ""}
                  onValueChange={(value) => handleInputChange(currentQuestion.id, value)}
                >
                  {currentQuestion.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              
              {currentQuestion.type === "checkbox" && (
                <div className="grid grid-cols-2 gap-2">
                  {currentQuestion.options?.map((option) => (
                    <Label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(farmerProfile[currentQuestion.id as keyof FarmerProfile] as string[] || []).includes(option)}
                        onChange={(e) => {
                          const currentValues = farmerProfile[currentQuestion.id as keyof FarmerProfile] as string[] || [];
                          if (e.target.checked) {
                            handleInputChange(currentQuestion.id, [...currentValues, option]);
                          } else {
                            handleInputChange(currentQuestion.id, currentValues.filter(v => v !== option));
                          }
                        }}
                        className="rounded"
                      />
                      <span>{option}</span>
                    </Label>
                  ))}
                </div>
              )}
              
              {/* Show crop compatibility warnings */}
              {cropCompatibility.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Crop Compatibility Analysis
                  </h4>
                  {cropCompatibility.map((result, index) => (
                    <div key={index} className="space-y-2">
                      <div className={`p-3 rounded-lg border ${
                        result.compatible 
                          ? 'bg-green-50 border-green-200 text-green-800' 
                          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {result.compatible ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          )}
                          <span className="font-medium">
                            {farmerProfile.cropTypes?.[index]} - Score: {result.score}/100
                          </span>
                        </div>
                        
                        {result.issues.length > 0 && (
                          <div className="space-y-2">
                            {result.issues.map((issue, issueIndex) => (
                              <div key={issueIndex} className="text-sm">
                                <p className="font-medium">{issue.message}</p>
                                <ul className="list-disc list-inside ml-2 text-xs opacity-80">
                                  {issue.suggestions.map((suggestion, suggIndex) => (
                                    <li key={suggIndex}>{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {result.recommendedAlternatives.length > 0 && (
                          <div className="mt-2 text-sm">
                            <p className="font-medium">Recommended alternatives:</p>
                            <p className="text-xs opacity-80">{result.recommendedAlternatives.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Show general crop recommendations */}
                  {farmerProfile.soilType && farmerProfile.irrigationType && farmerProfile.location && farmerProfile.plantingDate && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Recommended crops for your conditions:</h5>
                      <div className="flex flex-wrap gap-1">
                        {getRecommendedCrops(
                          farmerProfile.soilType,
                          farmerProfile.irrigationType,
                          farmerProfile.location,
                          farmerProfile.plantingDate
                        ).map((crop) => (
                          <Badge key={crop} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                {questionnaireStep > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setQuestionnaireStep(questionnaireStep - 1)}
                  >
                    Previous
                  </Button>
                )}
                <Button 
                  variant="farming" 
                  onClick={handleQuestionnaireNext}
                  className={questionnaireStep === 0 ? "ml-auto" : ""}
                >
                  {questionnaireStep === questionnaireQuestions.length - 1 ? "Start Chatting" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-4 h-screen">
        {/* Sidebar with farmer profile and suggestions */}
        <div className="lg:col-span-1 border-r bg-forest-green-light/30 p-4">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Farmer Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <strong>Name:</strong> {farmerProfile.name}
                </div>
                <div>
                  <strong>Farm Size:</strong> {farmerProfile.farmSize}
                </div>
                <div>
                  <strong>Location:</strong> {farmerProfile.location}
                </div>
                <div>
                  <strong>Experience:</strong> {farmerProfile.experience}
                </div>
                {farmerProfile.cropTypes && farmerProfile.cropTypes.length > 0 && (
                  <div>
                    <strong>Crops:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {farmerProfile.cropTypes.map((crop) => (
                        <Badge key={crop} variant="secondary" className="text-xs">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personalized Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getSuggestionsBasedOnProfile().map((suggestion, index) => (
                    <div key={index} className="text-sm p-2 bg-golden-wheat-light rounded">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Chat interface */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="border-b p-4 bg-primary text-primary-foreground">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Bot className="w-6 h-6" />
              AI Farming Assistant
            </h1>
            <p className="text-sm opacity-90">Ask me anything about farming!</p>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === "bot" && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                      {message.sender === "user" && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                      <div>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about crops, soil, weather, pests, or any farming question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                variant="chat"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}