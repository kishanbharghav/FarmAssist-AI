import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Key, ExternalLink } from "lucide-react";

interface ApiKeyFormProps {
  onApiKeySet: (apiKeys: { openrouter: string; openweather: string }) => void;
}

export default function ApiKeyForm({ onApiKeySet }: ApiKeyFormProps) {
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [openweatherKey, setOpenweatherKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (openrouterKey.trim() && openweatherKey.trim()) {
      onApiKeySet({
        openrouter: openrouterKey.trim(),
        openweather: openweatherKey.trim()
      });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Innovative farming background with floating elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-green via-primary to-golden-wheat"></div>
      <div className="absolute inset-0 bg-[url('/src/assets/farming-texture.jpg')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      
      {/* Floating farming elements */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-golden-wheat rounded-full opacity-60 animate-float-1"></div>
      <div className="absolute top-40 right-32 w-12 h-12 bg-earth-brown rounded-full opacity-50 animate-float-2"></div>
      <div className="absolute bottom-32 left-32 w-20 h-20 bg-forest-green rounded-full opacity-40 animate-float-3"></div>
      <div className="absolute bottom-20 right-20 w-14 h-14 bg-vibrant-orange rounded-full opacity-55 animate-float-1"></div>
      
      {/* Seed pattern overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--golden-wheat) / 0.1) 2px, transparent 2px),
                         radial-gradient(circle at 75% 75%, hsl(var(--earth-brown) / 0.1) 2px, transparent 2px)`,
        backgroundSize: '60px 60px, 80px 80px'
      }}></div>
      <Card className="w-full max-w-md shadow-strong backdrop-blur-sm bg-white/95 dark:bg-card/95 border-2 border-white/20 relative z-10">
        <CardHeader className="text-center">
          <Key className="w-12 h-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Setup AI Farming Assistant</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your API keys to enable intelligent farming assistance with live weather data
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
              <Input
                id="openrouter-key"
                type="password"
                placeholder="Enter your OpenRouter API key"
                value={openrouterKey}
                onChange={(e) => setOpenrouterKey(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="openweather-key">OpenWeather API Key</Label>
              <Input
                id="openweather-key"
                type="password"
                placeholder="Enter your OpenWeather API key"
                value={openweatherKey}
                onChange={(e) => setOpenweatherKey(e.target.value)}
                required
              />
            </div>
            
            <div className="text-xs text-muted-foreground space-y-2">
              <div className="flex flex-col gap-1">
                <p>
                  Need API keys?{" "}
                  <a 
                    href="https://openrouter.ai/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    OpenRouter <ExternalLink className="w-3 h-3" />
                  </a>
                  {" • "}
                  <a 
                    href="https://openweathermap.org/api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    OpenWeather <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
              <p>⚠️ Your API keys will be stored locally in your browser for this session only.</p>
            </div>
            
            <Button type="submit" className="w-full" variant="farming">
              Start Farming Assistant
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}