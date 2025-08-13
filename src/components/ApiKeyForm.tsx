import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Key, ExternalLink } from "lucide-react";

interface ApiKeyFormProps {
  onApiKeySet: (apiKey: string) => void;
}

export default function ApiKeyForm({ onApiKeySet }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-green-light via-background to-golden-wheat-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-medium">
        <CardHeader className="text-center">
          <Key className="w-12 h-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Setup OpenRouter AI</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your OpenRouter API key to enable intelligent farming assistance
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">OpenRouter API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your OpenRouter API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>
            
            <div className="text-xs text-muted-foreground space-y-2">
              <p>
                Don't have an OpenRouter API key?{" "}
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Get one here <ExternalLink className="w-3 h-3" />
                </a>
              </p>
              <p>⚠️ Your API key will be stored locally in your browser for this session only.</p>
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