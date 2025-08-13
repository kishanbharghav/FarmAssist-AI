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
    <div className="min-h-screen bg-gradient-to-br from-forest-green-light via-background to-golden-wheat-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-medium">
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