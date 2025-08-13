export interface CropRequirements {
  name: string;
  soilTypes: string[];
  irrigationMethods: string[];
  climateZones: string[];
  minTemperature: number;
  maxTemperature: number;
  waterRequirement: 'low' | 'medium' | 'high';
  growingSeason: string[];
  commonIssues: string[];
  alternatives?: string[];
}

export const CROP_DATABASE: Record<string, CropRequirements> = {
  wheat: {
    name: 'Wheat',
    soilTypes: ['Loamy soil', 'Clay soil', 'Sandy loam'],
    irrigationMethods: ['Rain-fed', 'Sprinkler irrigation', 'Flood irrigation'],
    climateZones: ['temperate', 'continental', 'semi-arid'],
    minTemperature: 3,
    maxTemperature: 32,
    waterRequirement: 'medium',
    growingSeason: ['Fall', 'Winter', 'Spring'],
    commonIssues: ['rust', 'aphids', 'drought stress'],
    alternatives: ['barley', 'oats', 'rye']
  },
  corn: {
    name: 'Corn',
    soilTypes: ['Loamy soil', 'Sandy loam', 'Well-drained soil'],
    irrigationMethods: ['Drip irrigation', 'Sprinkler irrigation', 'Center pivot'],
    climateZones: ['temperate', 'subtropical', 'continental'],
    minTemperature: 10,
    maxTemperature: 35,
    waterRequirement: 'high',
    growingSeason: ['Spring', 'Summer'],
    commonIssues: ['corn borer', 'drought', 'nitrogen deficiency'],
    alternatives: ['sorghum', 'millet', 'soybeans']
  },
  rice: {
    name: 'Rice',
    soilTypes: ['Clay soil', 'Clay loam', 'Heavy clay'],
    irrigationMethods: ['Flood irrigation', 'Paddy system', 'Continuous flooding'],
    climateZones: ['tropical', 'subtropical', 'humid temperate'],
    minTemperature: 16,
    maxTemperature: 38,
    waterRequirement: 'high',
    growingSeason: ['Spring', 'Summer', 'Monsoon'],
    commonIssues: ['blast disease', 'brown planthopper', 'water management'],
    alternatives: ['wheat', 'barley', 'millet']
  },
  tomatoes: {
    name: 'Tomatoes',
    soilTypes: ['Loamy soil', 'Sandy loam', 'Well-drained soil'],
    irrigationMethods: ['Drip irrigation', 'Micro-sprinkler', 'Furrow irrigation'],
    climateZones: ['temperate', 'subtropical', 'mediterranean'],
    minTemperature: 18,
    maxTemperature: 29,
    waterRequirement: 'medium',
    growingSeason: ['Spring', 'Summer', 'Fall'],
    commonIssues: ['blight', 'whitefly', 'calcium deficiency'],
    alternatives: ['peppers', 'eggplant', 'cucumber']
  },
  potatoes: {
    name: 'Potatoes',
    soilTypes: ['Sandy soil', 'Sandy loam', 'Loamy soil'],
    irrigationMethods: ['Sprinkler irrigation', 'Drip irrigation', 'Furrow irrigation'],
    climateZones: ['temperate', 'cool temperate', 'highland tropical'],
    minTemperature: 7,
    maxTemperature: 24,
    waterRequirement: 'medium',
    growingSeason: ['Spring', 'Fall'],
    commonIssues: ['late blight', 'potato beetle', 'scab'],
    alternatives: ['sweet potatoes', 'turnips', 'carrots']
  },
  soybeans: {
    name: 'Soybeans',
    soilTypes: ['Loamy soil', 'Clay loam', 'Well-drained soil'],
    irrigationMethods: ['Rain-fed', 'Sprinkler irrigation', 'Drip irrigation'],
    climateZones: ['temperate', 'subtropical', 'continental'],
    minTemperature: 10,
    maxTemperature: 30,
    waterRequirement: 'medium',
    growingSeason: ['Spring', 'Summer'],
    commonIssues: ['soybean rust', 'aphids', 'white mold'],
    alternatives: ['corn', 'sunflower', 'canola']
  },
  carrots: {
    name: 'Carrots',
    soilTypes: ['Sandy soil', 'Sandy loam', 'Deep loamy soil'],
    irrigationMethods: ['Drip irrigation', 'Sprinkler irrigation', 'Surface irrigation'],
    climateZones: ['temperate', 'cool temperate', 'mediterranean'],
    minTemperature: 7,
    maxTemperature: 24,
    waterRequirement: 'medium',
    growingSeason: ['Spring', 'Fall', 'Winter'],
    commonIssues: ['carrot fly', 'root rot', 'splitting'],
    alternatives: ['parsnips', 'turnips', 'beets']
  },
  lettuce: {
    name: 'Lettuce',
    soilTypes: ['Loamy soil', 'Sandy loam', 'Well-drained soil'],
    irrigationMethods: ['Drip irrigation', 'Micro-sprinkler', 'Surface irrigation'],
    climateZones: ['temperate', 'cool temperate', 'mediterranean'],
    minTemperature: 4,
    maxTemperature: 20,
    waterRequirement: 'medium',
    growingSeason: ['Spring', 'Fall', 'Winter'],
    commonIssues: ['aphids', 'downy mildew', 'tip burn'],
    alternatives: ['spinach', 'kale', 'chard']
  },
  // Indian staple crops
  basmati_rice: {
    name: 'Basmati Rice',
    soilTypes: ['Clay soil', 'Clay loam', 'Alluvial soil'],
    irrigationMethods: ['Flood irrigation', 'Paddy system', 'Continuous flooding'],
    climateZones: ['subtropical', 'tropical', 'humid temperate'],
    minTemperature: 20,
    maxTemperature: 37,
    waterRequirement: 'high',
    growingSeason: ['Monsoon', 'Kharif'],
    commonIssues: ['blast disease', 'stem borer', 'bacterial blight'],
    alternatives: ['wheat', 'sugarcane', 'cotton']
  },
  sugarcane: {
    name: 'Sugarcane',
    soilTypes: ['Clay loam', 'Sandy loam', 'Alluvial soil'],
    irrigationMethods: ['Flood irrigation', 'Drip irrigation', 'Furrow irrigation'],
    climateZones: ['tropical', 'subtropical'],
    minTemperature: 20,
    maxTemperature: 38,
    waterRequirement: 'high',
    growingSeason: ['Year-round', 'Monsoon', 'Winter'],
    commonIssues: ['red rot', 'smut', 'aphids'],
    alternatives: ['cotton', 'maize', 'sorghum']
  },
  cotton: {
    name: 'Cotton',
    soilTypes: ['Black cotton soil', 'Clay loam', 'Sandy loam'],
    irrigationMethods: ['Drip irrigation', 'Sprinkler irrigation', 'Flood irrigation'],
    climateZones: ['semi-arid', 'subtropical', 'tropical'],
    minTemperature: 15,
    maxTemperature: 35,
    waterRequirement: 'medium',
    growingSeason: ['Kharif', 'Monsoon'],
    commonIssues: ['bollworm', 'aphids', 'whitefly'],
    alternatives: ['soybeans', 'sunflower', 'maize']
  },
  onions: {
    name: 'Onions',
    soilTypes: ['Sandy loam', 'Loamy soil', 'Clay loam'],
    irrigationMethods: ['Drip irrigation', 'Sprinkler irrigation', 'Furrow irrigation'],
    climateZones: ['temperate', 'subtropical', 'semi-arid'],
    minTemperature: 10,
    maxTemperature: 30,
    waterRequirement: 'medium',
    growingSeason: ['Rabi', 'Winter', 'Spring'],
    commonIssues: ['purple blotch', 'thrips', 'neck rot'],
    alternatives: ['garlic', 'shallots', 'leeks']
  },
  turmeric: {
    name: 'Turmeric',
    soilTypes: ['Sandy loam', 'Clay loam', 'Red soil'],
    irrigationMethods: ['Drip irrigation', 'Sprinkler irrigation', 'Rain-fed'],
    climateZones: ['tropical', 'subtropical'],
    minTemperature: 20,
    maxTemperature: 35,
    waterRequirement: 'medium',
    growingSeason: ['Monsoon', 'Kharif'],
    commonIssues: ['rhizome rot', 'leaf spot', 'shoot borer'],
    alternatives: ['ginger', 'cardamom', 'black pepper']
  },
  chickpeas: {
    name: 'Chickpeas (Chana)',
    soilTypes: ['Sandy loam', 'Clay loam', 'Black soil'],
    irrigationMethods: ['Rain-fed', 'Sprinkler irrigation', 'Drip irrigation'],
    climateZones: ['semi-arid', 'temperate', 'subtropical'],
    minTemperature: 10,
    maxTemperature: 30,
    waterRequirement: 'low',
    growingSeason: ['Rabi', 'Winter'],
    commonIssues: ['wilt', 'pod borer', 'aphids'],
    alternatives: ['lentils', 'field peas', 'black gram']
  },
  mustard: {
    name: 'Mustard',
    soilTypes: ['Sandy loam', 'Clay loam', 'Alluvial soil'],
    irrigationMethods: ['Rain-fed', 'Sprinkler irrigation', 'Flood irrigation'],
    climateZones: ['temperate', 'semi-arid', 'subtropical'],
    minTemperature: 5,
    maxTemperature: 25,
    waterRequirement: 'low',
    growingSeason: ['Rabi', 'Winter'],
    commonIssues: ['aphids', 'white rust', 'alternaria blight'],
    alternatives: ['sesame', 'sunflower', 'safflower']
  },
  millet: {
    name: 'Pearl Millet (Bajra)',
    soilTypes: ['Sandy soil', 'Sandy loam', 'Drought-prone soil'],
    irrigationMethods: ['Rain-fed', 'Drip irrigation', 'Sprinkler irrigation'],
    climateZones: ['arid', 'semi-arid', 'tropical'],
    minTemperature: 20,
    maxTemperature: 42,
    waterRequirement: 'low',
    growingSeason: ['Kharif', 'Monsoon'],
    commonIssues: ['downy mildew', 'smut', 'shoot fly'],
    alternatives: ['sorghum', 'maize', 'finger millet']
  },
  eggplant: {
    name: 'Eggplant (Brinjal)',
    soilTypes: ['Sandy loam', 'Clay loam', 'Red soil'],
    irrigationMethods: ['Drip irrigation', 'Furrow irrigation', 'Sprinkler irrigation'],
    climateZones: ['tropical', 'subtropical'],
    minTemperature: 18,
    maxTemperature: 32,
    waterRequirement: 'medium',
    growingSeason: ['Year-round', 'Kharif', 'Rabi'],
    commonIssues: ['fruit borer', 'bacterial wilt', 'aphids'],
    alternatives: ['tomatoes', 'peppers', 'okra']
  },
  okra: {
    name: 'Okra (Bhindi)',
    soilTypes: ['Sandy loam', 'Clay loam', 'Well-drained soil'],
    irrigationMethods: ['Drip irrigation', 'Furrow irrigation', 'Rain-fed'],
    climateZones: ['tropical', 'subtropical', 'warm temperate'],
    minTemperature: 20,
    maxTemperature: 35,
    waterRequirement: 'medium',
    growingSeason: ['Kharif', 'Summer', 'Monsoon'],
    commonIssues: ['fruit borer', 'aphids', 'powdery mildew'],
    alternatives: ['eggplant', 'tomatoes', 'peppers']
  }
};

export interface CompatibilityIssue {
  type: 'soil' | 'irrigation' | 'climate' | 'season';
  severity: 'warning' | 'error';
  message: string;
  suggestions: string[];
}

export interface CompatibilityResult {
  compatible: boolean;
  issues: CompatibilityIssue[];
  recommendedAlternatives: string[];
  score: number; // 0-100
}

export function checkCropCompatibility(
  cropName: string,
  soilType: string,
  irrigationMethod: string,
  location: string,
  plantingSeason: string
): CompatibilityResult {
  const crop = CROP_DATABASE[cropName.toLowerCase()];
  
  if (!crop) {
    return {
      compatible: false,
      issues: [{
        type: 'climate',
        severity: 'error',
        message: `Crop "${cropName}" not found in database`,
        suggestions: ['Choose from available crops in the list']
      }],
      recommendedAlternatives: [],
      score: 0
    };
  }

  const issues: CompatibilityIssue[] = [];
  let score = 100;

  // Check soil compatibility
  if (!crop.soilTypes.includes(soilType)) {
    issues.push({
      type: 'soil',
      severity: 'error',
      message: `${crop.name} is not well-suited for ${soilType}`,
      suggestions: [
        `Consider soil amendments to improve drainage/texture`,
        `Recommended soil types: ${crop.soilTypes.join(', ')}`,
        `Alternative crops: ${crop.alternatives?.join(', ') || 'consult local extension'}`
      ]
    });
    score -= 30;
  }

  // Check irrigation compatibility
  if (!crop.irrigationMethods.includes(irrigationMethod)) {
    issues.push({
      type: 'irrigation',
      severity: 'warning',
      message: `${irrigationMethod} may not be optimal for ${crop.name}`,
      suggestions: [
        `Recommended irrigation: ${crop.irrigationMethods.join(', ')}`,
        `Monitor water stress carefully with current method`,
        `Consider upgrading irrigation system for better yields`
      ]
    });
    score -= 20;
  }

  // Check growing season
  if (!crop.growingSeason.includes(plantingSeason)) {
    issues.push({
      type: 'season',
      severity: 'warning',
      message: `${plantingSeason} planting may not be optimal for ${crop.name}`,
      suggestions: [
        `Recommended seasons: ${crop.growingSeason.join(', ')}`,
        `Consider season extension techniques`,
        `Plan for potential yield reduction`
      ]
    });
    score -= 15;
  }

  // Climate zone check (simplified - would need weather API integration)
  const locationLower = location.toLowerCase();
  let climateCompatible = true;
  
  // Basic climate zone inference from location keywords
  if ((locationLower.includes('tropical') || locationLower.includes('hot')) && 
      !crop.climateZones.includes('tropical') && !crop.climateZones.includes('subtropical')) {
    climateCompatible = false;
  } else if ((locationLower.includes('cold') || locationLower.includes('arctic')) && 
             !crop.climateZones.includes('temperate') && !crop.climateZones.includes('cool temperate')) {
    climateCompatible = false;
  }

  if (!climateCompatible) {
    issues.push({
      type: 'climate',
      severity: 'error',
      message: `Climate in ${location} may not be suitable for ${crop.name}`,
      suggestions: [
        `Suitable climates: ${crop.climateZones.join(', ')}`,
        `Consider greenhouse cultivation`,
        `Alternative crops: ${crop.alternatives?.join(', ') || 'consult local extension'}`
      ]
    });
    score -= 35;
  }

  const compatible = issues.length === 0 || !issues.some(issue => issue.severity === 'error');
  const recommendedAlternatives = compatible ? [] : (crop.alternatives || []);

  return {
    compatible,
    issues,
    recommendedAlternatives,
    score: Math.max(0, score)
  };
}

export function getRecommendedCrops(
  soilType: string,
  irrigationMethod: string,
  location: string,
  plantingSeason: string
): string[] {
  const recommendations: Array<{ crop: string; score: number }> = [];

  Object.keys(CROP_DATABASE).forEach(cropKey => {
    const result = checkCropCompatibility(cropKey, soilType, irrigationMethod, location, plantingSeason);
    if (result.score > 70) {
      recommendations.push({ crop: CROP_DATABASE[cropKey].name, score: result.score });
    }
  });

  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(r => r.crop);
}