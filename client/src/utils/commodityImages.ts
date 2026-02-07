// Agmarknet API provides only textual mandi price data. 
// Commodity images are mapped locally based on commodity name.

export const commodityImageMap: { [key: string]: string } = {
  // Cereals
  'Wheat': '🌾',
  'Rice': '🍚',
  'Maize': '🌽',
  'Jowar': '🌾',
  'Bajra': '🌾',

  // Pulses
  'Gram': '👉',
  'Tur': '👉',
  'Masoor': '👉',

  // Oilseeds
  'Groundnut': '🥜',
  'Mustard': '🌻',

  // Cash Crops
  'Cotton': '⚪',
  'Sugarcane': '🎋',

  // Spices
  'Turmeric': '🟡',
  'Chili': '🌶️',

  // Vegetables
  'Potato': '🥔',
  'Onion': '🧅',
  'Tomato': '🍅',
  'Cabbage': '🥬',
  'Carrot': '🥕',

  // Fruits
  'Mango': '🥭',

  // Others
  'Tea': '🍵',
};

// Get emoji for commodity
export const getCommodityEmoji = (commodityName: string): string => {
  const normalized = commodityName.toLowerCase().trim();
  
  for (const [key, emoji] of Object.entries(commodityImageMap)) {
    if (normalized.includes(key.toLowerCase())) {
      return emoji;
    }
  }
  
  return '🌾'; // Default fallback emoji
};

// Get color code for commodity category
export const getCommodityColor = (commodityName: string): string => {
  const normalized = commodityName.toLowerCase();
  
  if (['wheat', 'rice', 'maize', 'jowar', 'bajra'].some(c => normalized.includes(c))) {
    return '#d4a574'; // Brown
  }
  if (['gram', 'tur', 'masoor'].some(c => normalized.includes(c))) {
    return '#8b4513'; // Brown
  }
  if (['groundnut', 'mustard', 'sesame', 'soybean'].some(c => normalized.includes(c))) {
    return '#daa520'; // Golden
  }
  if (['cotton', 'jute'].some(c => normalized.includes(c))) {
    return '#f0f0f0'; // White
  }
  if (['potato', 'onion', 'tomato', 'cabbage', 'carrot'].some(c => normalized.includes(c))) {
    return '#2ecc71'; // Green
  }
  
  return '#3498db'; // Blue default
};
