import { pipeline, Pipeline } from "@huggingface/transformers";

interface DatasetFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: any[];
  columns: string[];
  uploadedAt: Date;
}

interface MLPrediction {
  type: 'yield' | 'price' | 'weather' | 'disease' | 'general';
  confidence: number;
  prediction: any;
  explanation: string;
  dataUsed: string[];
}

interface PredictionRequest {
  query: string;
  farmerProfile: any;
  datasets: DatasetFile[];
  context?: string;
}

class MLPredictionService {
  private textClassifier: Pipeline | null = null;
  private textGenerator: Pipeline | null = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize text classification pipeline for intent detection
      this.textClassifier = await pipeline(
        "text-classification",
        "microsoft/DialoGPT-medium",
        { device: "webgpu" }
      );

      // Initialize text generation for insights
      this.textGenerator = await pipeline(
        "text-generation",
        "microsoft/DialoGPT-medium",
        { device: "webgpu" }
      );

      this.initialized = true;
      console.log("ML Prediction Service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize ML models:", error);
      // Fallback to CPU if WebGPU fails
      try {
        this.textClassifier = await pipeline(
          "text-classification",
          "microsoft/DialoGPT-medium"
        );
        this.initialized = true;
      } catch (fallbackError) {
        console.error("Failed to initialize ML models on CPU:", fallbackError);
      }
    }
  }

  // Determine if the query needs ML prediction
  determineQueryType(query: string): 'yield' | 'price' | 'weather' | 'disease' | 'general' {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('yield') || lowerQuery.includes('harvest') || lowerQuery.includes('production')) {
      return 'yield';
    }
    if (lowerQuery.includes('price') || lowerQuery.includes('market') || lowerQuery.includes('sell')) {
      return 'price';
    }
    if (lowerQuery.includes('weather') || lowerQuery.includes('rain') || lowerQuery.includes('temperature')) {
      return 'weather';
    }
    if (lowerQuery.includes('disease') || lowerQuery.includes('pest') || lowerQuery.includes('infection')) {
      return 'disease';
    }
    
    return 'general';
  }

  // Check if datasets contain relevant data for the query
  hasRelevantData(queryType: string, datasets: DatasetFile[]): boolean {
    const relevantColumns: { [key: string]: string[] } = {
      yield: ['yield', 'production', 'harvest', 'output', 'kg', 'tons', 'bushels'],
      price: ['price', 'cost', 'market', 'value', 'sell', 'buy', 'dollar', 'currency'],
      weather: ['temperature', 'rainfall', 'humidity', 'weather', 'climate', 'precipitation'],
      disease: ['disease', 'pest', 'infection', 'damage', 'loss', 'health', 'treatment']
    };

    const searchTerms = relevantColumns[queryType] || [];
    
    return datasets.some(dataset => 
      dataset.columns.some(column => 
        searchTerms.some(term => 
          column.toLowerCase().includes(term)
        )
      )
    );
  }

  // Perform yield prediction using historical data
  predictYield(datasets: DatasetFile[], cropType: string, conditions: any): MLPrediction {
    try {
      // Find relevant yield datasets
      const yieldDatasets = datasets.filter(dataset => 
        dataset.columns.some(col => 
          col.toLowerCase().includes('yield') || 
          col.toLowerCase().includes('production') ||
          col.toLowerCase().includes('harvest')
        )
      );

      if (yieldDatasets.length === 0) {
        return {
          type: 'yield',
          confidence: 0,
          prediction: null,
          explanation: "No yield data available for prediction",
          dataUsed: []
        };
      }

      // Simple statistical analysis
      const allYieldData = yieldDatasets.flatMap(dataset => 
        dataset.data.map(row => {
          const yieldCol = dataset.columns.find(col => 
            col.toLowerCase().includes('yield') || 
            col.toLowerCase().includes('production')
          );
          return yieldCol ? parseFloat(row[yieldCol]) || 0 : 0;
        }).filter(val => val > 0)
      );

      if (allYieldData.length === 0) {
        return {
          type: 'yield',
          confidence: 0.2,
          prediction: null,
          explanation: "Insufficient yield data for reliable prediction",
          dataUsed: yieldDatasets.map(d => d.name)
        };
      }

      // Calculate statistics
      const average = allYieldData.reduce((a, b) => a + b, 0) / allYieldData.length;
      const sortedData = allYieldData.sort((a, b) => a - b);
      const median = sortedData[Math.floor(sortedData.length / 2)];
      const min = Math.min(...allYieldData);
      const max = Math.max(...allYieldData);

      // Factor in conditions (simplified)
      let adjustedPrediction = average;
      if (conditions.weather === 'good') adjustedPrediction *= 1.1;
      if (conditions.weather === 'poor') adjustedPrediction *= 0.9;
      if (conditions.soilQuality === 'high') adjustedPrediction *= 1.05;
      if (conditions.soilQuality === 'low') adjustedPrediction *= 0.95;

      return {
        type: 'yield',
        confidence: Math.min(0.85, Math.max(0.4, allYieldData.length / 100)),
        prediction: {
          expected: Math.round(adjustedPrediction * 100) / 100,
          range: {
            min: Math.round(min * 100) / 100,
            max: Math.round(max * 100) / 100,
            average: Math.round(average * 100) / 100,
            median: Math.round(median * 100) / 100
          },
          confidence_interval: {
            lower: Math.round(adjustedPrediction * 0.8 * 100) / 100,
            upper: Math.round(adjustedPrediction * 1.2 * 100) / 100
          }
        },
        explanation: `Based on analysis of ${allYieldData.length} data points from ${yieldDatasets.length} dataset(s). Historical average: ${Math.round(average * 100) / 100}. Adjusted for current conditions.`,
        dataUsed: yieldDatasets.map(d => d.name)
      };
    } catch (error) {
      console.error('Error in yield prediction:', error);
      return {
        type: 'yield',
        confidence: 0,
        prediction: null,
        explanation: "Error occurred during yield prediction",
        dataUsed: []
      };
    }
  }

  // Predict market prices
  predictPrice(datasets: DatasetFile[], cropType: string): MLPrediction {
    try {
      const priceDatasets = datasets.filter(dataset =>
        dataset.columns.some(col =>
          col.toLowerCase().includes('price') ||
          col.toLowerCase().includes('cost') ||
          col.toLowerCase().includes('market')
        )
      );

      if (priceDatasets.length === 0) {
        return {
          type: 'price',
          confidence: 0,
          prediction: null,
          explanation: "No price data available for prediction",
          dataUsed: []
        };
      }

      // Extract price data
      const priceData = priceDatasets.flatMap(dataset => {
        const priceCol = dataset.columns.find(col =>
          col.toLowerCase().includes('price') ||
          col.toLowerCase().includes('cost')
        );
        
        return dataset.data.map(row => {
          const price = priceCol ? parseFloat(row[priceCol]) : 0;
          const date = row.date || row.Date || row.timestamp;
          return { price, date, crop: row.crop || cropType };
        }).filter(item => item.price > 0);
      });

      if (priceData.length === 0) {
        return {
          type: 'price',
          confidence: 0.2,
          prediction: null,
          explanation: "Insufficient price data for reliable prediction",
          dataUsed: priceDatasets.map(d => d.name)
        };
      }

      // Simple trend analysis
      const prices = priceData.map(d => d.price);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const recentPrices = priceData.slice(-10).map(d => d.price);
      const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
      
      const trend = recentAvg > avgPrice ? 'increasing' : 'decreasing';
      const trendStrength = Math.abs(recentAvg - avgPrice) / avgPrice;

      return {
        type: 'price',
        confidence: Math.min(0.8, Math.max(0.4, priceData.length / 50)),
        prediction: {
          current_average: Math.round(avgPrice * 100) / 100,
          recent_average: Math.round(recentAvg * 100) / 100,
          trend,
          trend_strength: Math.round(trendStrength * 100 * 100) / 100,
          predicted_next_month: Math.round(recentAvg * (trend === 'increasing' ? 1.05 : 0.95) * 100) / 100
        },
        explanation: `Based on ${priceData.length} price records. Current trend is ${trend} with ${Math.round(trendStrength * 100)}% strength.`,
        dataUsed: priceDatasets.map(d => d.name)
      };
    } catch (error) {
      console.error('Error in price prediction:', error);
      return {
        type: 'price',
        confidence: 0,
        prediction: null,
        explanation: "Error occurred during price prediction",
        dataUsed: []
      };
    }
  }

  // Main prediction method
  async makePrediction(request: PredictionRequest): Promise<MLPrediction | null> {
    await this.initialize();

    const queryType = this.determineQueryType(request.query);
    
    // Check if we have relevant data
    if (!this.hasRelevantData(queryType, request.datasets)) {
      return null; // Fall back to AI
    }

    const cropType = request.farmerProfile.cropTypes?.[0] || 'general';
    
    switch (queryType) {
      case 'yield':
        return this.predictYield(request.datasets, cropType, {
          weather: 'good', // This would come from weather service
          soilQuality: request.farmerProfile.soilType === 'Loamy' ? 'high' : 'medium'
        });
      
      case 'price':
        return this.predictPrice(request.datasets, cropType);
        
      case 'weather':
      case 'disease':
      case 'general':
      default:
        return null; // Fall back to AI for these
    }
  }

  // Generate insights from datasets
  generateDataInsights(datasets: DatasetFile[]): string[] {
    const insights: string[] = [];
    
    try {
      datasets.forEach(dataset => {
        // Dataset overview
        insights.push(`📊 ${dataset.name}: ${dataset.data.length} records with ${dataset.columns.length} variables`);
        
        // Identify data types
        const numericColumns = dataset.columns.filter(col => {
          const firstValue = dataset.data[0]?.[col];
          return typeof firstValue === 'number' || !isNaN(parseFloat(firstValue));
        });
        
        if (numericColumns.length > 0) {
          insights.push(`🔢 Numeric data available for: ${numericColumns.slice(0, 3).join(', ')}${numericColumns.length > 3 ? '...' : ''}`);
        }
        
        // Check for time series data
        const hasTimeData = dataset.columns.some(col => 
          col.toLowerCase().includes('date') || 
          col.toLowerCase().includes('time') ||
          col.toLowerCase().includes('year')
        );
        
        if (hasTimeData) {
          insights.push(`📅 Time-series data detected - can analyze trends and patterns`);
        }
      });
      
      if (datasets.length > 1) {
        insights.push(`🔗 Multiple datasets available for cross-analysis and correlation studies`);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
    }
    
    return insights;
  }
}

export const mlPredictionService = new MLPredictionService();
export type { MLPrediction, PredictionRequest, DatasetFile };