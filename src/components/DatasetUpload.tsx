import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, File, X, Database, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DatasetFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: any[];
  columns: string[];
  uploadedAt: Date;
}

interface DatasetUploadProps {
  onDatasetsChange: (datasets: DatasetFile[]) => void;
  existingDatasets: DatasetFile[];
}

export default function DatasetUpload({ onDatasetsChange, existingDatasets }: DatasetUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const parseCSV = (csvText: string, filename: string): DatasetFile | null => {
    try {
      const lines = csvText.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        throw new Error('CSV must have at least a header and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/\"/g, ''));
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/\"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          const value = values[index] || '';
          // Try to parse as number if possible
          const numValue = parseFloat(value);
          row[header] = isNaN(numValue) ? value : numValue;
        });
        return row;
      });

      return {
        id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: filename,
        type: 'csv',
        size: csvText.length,
        data,
        columns: headers,
        uploadedAt: new Date()
      };
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast({
        title: "CSV Parse Error",
        description: `Failed to parse ${filename}: ${(error as Error).message}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    const newDatasets: DatasetFile[] = [];

    for (const file of Array.from(files)) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        try {
          const text = await file.text();
          const dataset = parseCSV(text, file.name);
          if (dataset) {
            newDatasets.push(dataset);
            
            // Store in Supabase for persistence
            const { error } = await supabase
              .from('farming_datasets')
              .insert({
                id: dataset.id,
                name: dataset.name,
                type: dataset.type,
                columns: dataset.columns,
                data: dataset.data,
                size: dataset.size
              });

            if (error) {
              console.error('Error storing dataset:', error);
              toast({
                title: "Storage Error",
                description: `Failed to store ${file.name} in database`,
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          toast({
            title: "Upload Error",
            description: `Failed to process ${file.name}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a CSV file`,
          variant: "destructive",
        });
      }
    }

    if (newDatasets.length > 0) {
      const updatedDatasets = [...existingDatasets, ...newDatasets];
      onDatasetsChange(updatedDatasets);
      toast({
        title: "Upload Successful",
        description: `Uploaded ${newDatasets.length} dataset(s)`,
      });
    }

    setIsUploading(false);
  }, [existingDatasets, onDatasetsChange, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const removeDataset = async (datasetId: string) => {
    try {
      const { error } = await supabase
        .from('farming_datasets')
        .delete()
        .eq('id', datasetId);

      if (error) {
        console.error('Error removing dataset:', error);
        toast({
          title: "Delete Error",
          description: "Failed to remove dataset from database",
          variant: "destructive",
        });
        return;
      }

      const updatedDatasets = existingDatasets.filter(d => d.id !== datasetId);
      onDatasetsChange(updatedDatasets);
      toast({
        title: "Dataset Removed",
        description: "Dataset successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Delete Error",
        description: "Failed to remove dataset",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Farm Data Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/10' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg mb-2">Drop CSV files here or click to upload</p>
          <p className="text-sm text-muted-foreground mb-4">
            Support for crop yields, weather data, soil analysis, market prices, etc.
          </p>
          <Input
            type="file"
            multiple
            accept=".csv"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
            id="dataset-upload"
          />
          <Label htmlFor="dataset-upload">
            <Button variant="outline" disabled={isUploading} asChild>
              <span>
                {isUploading ? 'Uploading...' : 'Choose Files'}
              </span>
            </Button>
          </Label>
        </div>

        {/* Existing Datasets */}
        {existingDatasets.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Uploaded Datasets ({existingDatasets.length})
            </h4>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {existingDatasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">{dataset.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {dataset.data.length} rows, {dataset.columns.length} columns
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {dataset.columns.length} fields
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDataset(dataset.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {existingDatasets.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <p>Your datasets will be used for:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>ML-based yield predictions</li>
              <li>Pattern analysis and insights</li>
              <li>Personalized recommendations</li>
              <li>Market trend forecasting</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
