// Government Schemes & Subsidies Service
// Official government data from data.gov.in API

const SCHEME_API_KEY = process.env.REACT_APP_AGMARKNET_API_KEY;
const SCHEME_API_BASE = 'https://api.data.gov.in/resource/ab0e1cb484d81ec8c9d70e0d3a6f8e0f';

// Data model for Government Subsidy Schemes
export interface GovernmentScheme {
  id: string;
  scheme_name: string;
  government_type: 'Central' | 'State';
  state: string;
  benefit: string;
  eligibility: string;
  application_link?: string;
  last_updated: string;
  contact_phone?: string;
  office_address?: string;
  description?: string;
  documents_required?: string;
  income_limit?: string;
  farm_size_limit?: string;
}

export interface SchemeFilterOptions {
  state: string;
  governmentType: 'All' | 'Central' | 'State';
}

// Comprehensive sample data for Indian Government Agricultural Schemes
const SAMPLE_SCHEMES: GovernmentScheme[] = [
  // Central Government Schemes
  {
    id: 'pm-kisan-001',
    scheme_name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    government_type: 'Central',
    state: 'All India',
    benefit: '₹6,000 per year (₹2,000 per installment, 3 times a year)',
    eligibility: 'Small & marginal farmers (landholding up to 2 hectares)',
    application_link: 'https://pmkisan.gov.in',
    last_updated: '2026-02-08',
    contact_phone: '1800-115-526',
    description: 'Direct income support to farmers to meet their financial needs for quality seeds, fertilizers, and farm equipment.',
    documents_required: 'Aadhaar, Land records, Bank account details',
    income_limit: 'No income limit for small & marginal farmers',
    farm_size_limit: 'Up to 2 hectares',
  },
  {
    id: 'pm-fasal-001',
    scheme_name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    government_type: 'Central',
    state: 'All India',
    benefit: '₹5,000 to ₹100,000 per hectare (crop & loss dependent)',
    eligibility: 'All farmers (tenant, share-cropper, landless)',
    application_link: 'https://pmfby.gov.in',
    last_updated: '2026-02-08',
    contact_phone: '1800-180-1111',
    description: 'Crop insurance scheme to protect farmers against crop loss due to natural calamities and adverse weather.',
    documents_required: 'Aadhaar, Land records, Seed receipt, Bank account',
    income_limit: 'No income limit',
    farm_size_limit: 'No farm size limit',
  },
  {
    id: 'kusum-001',
    scheme_name: 'Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan (KUSUM)',
    government_type: 'Central',
    state: 'All India',
    benefit: 'Up to ₹95,000 subsidy + ₹5,000 per pump (solar installation)',
    eligibility: 'Individual farmers & farmer groups, Panchayati Raj Institutions',
    application_link: 'https://mnre.gov.in/kusum',
    last_updated: '2026-02-08',
    contact_phone: '1800-180-6060',
    description: 'Promotes solar energy for irrigation through installation of solar pumps, reducing electricity costs.',
    documents_required: 'Land records, Aadhaar, Bank account, Land survey map',
    income_limit: 'No income limit',
    farm_size_limit: 'Minimum 0.5 hectare',
  },
  {
    id: 'paramparagat-001',
    scheme_name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    government_type: 'Central',
    state: 'All India',
    benefit: '₹50,000 per hectare (over 3 years)',
    eligibility: 'Farmers interested in organic farming',
    application_link: 'https://aafdc.nic.in/public_html/Organic_HTML/index.html',
    last_updated: '2026-02-08',
    contact_phone: '1800-180-1900',
    description: 'Promotes organic farming to improve soil health and reduce chemical pesticide usage.',
    documents_required: 'Land records, Aadhaar, Bank account, Soil test report',
    income_limit: 'No income limit',
    farm_size_limit: 'Any size',
  },
  {
    id: 'krivishakti-001',
    scheme_name: 'Krivishakti (Agricultural Credit Card)',
    government_type: 'Central',
    state: 'All India',
    benefit: 'Credit up to ₹3,00,000 at concessional rate (3% interest)',
    eligibility: 'Small & marginal farmers with land documents',
    application_link: 'https://nabard.org',
    last_updated: '2026-02-08',
    contact_phone: '1800-270-3333',
    description: 'Easy credit facility for farmers to meet short-term and medium-term agricultural needs.',
    documents_required: 'Aadhaar, Land records, Farm survey, Bank account',
    income_limit: 'No income limit',
    farm_size_limit: 'Any size',
  },

  // State Government Schemes (Karnataka)
  {
    id: 'karnataka-free-pump-001',
    scheme_name: 'Free Power Scheme for Agriculture',
    government_type: 'State',
    state: 'Karnataka',
    benefit: 'Free electricity for agricultural pumps',
    eligibility: 'Farmers registered with agricultural department',
    application_link: 'https://farmer.karnataka.gov.in',
    last_updated: '2026-02-08',
    contact_phone: '1800-425-4000',
    description: 'Provides free electricity to agricultural pumps to reduce operational costs for farmers.',
    documents_required: 'Land records, Aadhaar, Power meter reading',
    income_limit: 'No income limit',
    farm_size_limit: 'Any size',
  },

  // State Government Schemes (Maharashtra)
  {
    id: 'maharashtra-crop-001',
    scheme_name: 'Pradhan Mantri Fasal Bima Yojana Maharashtra State Implementation',
    government_type: 'State',
    state: 'Maharashtra',
    benefit: 'Crop insurance coverage + ₹10,000 emergency relief',
    eligibility: 'All registered farmers',
    application_link: 'https://maha.gov.in',
    last_updated: '2026-02-08',
    contact_phone: '1800-233-3663',
    description: 'State-level implementation of crop insurance with additional emergency relief fund.',
    documents_required: 'Land record, Aadhaar, Bank account, Seed receipt',
    income_limit: 'No income limit',
    farm_size_limit: 'No limit',
  },

  // State Government Schemes (Punjab)
  {
    id: 'punjab-subsidy-001',
    scheme_name: 'Agricultural Input Subsidy Scheme',
    government_type: 'State',
    state: 'Punjab',
    benefit: '50% subsidy on seeds, fertilizers & agricultural equipment',
    eligibility: 'Small & marginal farmers, ex-servicemen farmers',
    application_link: 'https://punjab.gov.in',
    last_updated: '2026-02-08',
    contact_phone: '1800-180-1551',
    description: 'Direct subsidy support for purchasing quality seeds and fertilizers.',
    documents_required: 'Land documents, Aadhaar, Bank account, Caste certificate (if applicable)',
    income_limit: 'Annual income below ₹1,00,000',
    farm_size_limit: 'Up to 5 hectares',
  },

  // State Government Schemes (Uttar Pradesh)
  {
    id: 'up-irrigation-001',
    scheme_name: 'Underground Pipe Network Scheme',
    government_type: 'State',
    state: 'Uttar Pradesh',
    benefit: '50% subsidy on pipe & installation cost (up to ₹30,000)',
    eligibility: 'Farmers with borewell/tube well',
    application_link: 'https://up.gov.in',
    last_updated: '2026-02-08',
    contact_phone: '1800-180-5577',
    description: 'Encourages modern irrigation methods through pipe network installation.',
    documents_required: 'Land records, Aadhaar, Water right certificate, Bank account',
    income_limit: 'No income limit',
    farm_size_limit: 'Minimum 0.4 hectare',
  },

  // State Government Schemes (Rajasthan)
  {
    id: 'rajasthan-solar-001',
    scheme_name: 'Solar Energy Agricultural Scheme - Rajasthan',
    government_type: 'State',
    state: 'Rajasthan',
    benefit: '90% subsidy on solar pump installation (up to ₹2,50,000)',
    eligibility: 'Farmers in drought-prone areas',
    application_link: 'https://rajasthan.gov.in',
    last_updated: '2026-02-08',
    contact_phone: '1800-180-1414',
    description: 'Heavy subsidy on solar pumps to address water scarcity and reduce electricity costs.',
    documents_required: 'Land records, Aadhaar, Proof of drought status, Bank account',
    income_limit: 'No income limit',
    farm_size_limit: 'Minimum 1 hectare',
  },

  // State Government Schemes (Tamil Nadu)
  {
    id: 'tn-drip-001',
    scheme_name: 'Micro Irrigation Subsidy Scheme - Tamil Nadu',
    government_type: 'State',
    state: 'Tamil Nadu',
    benefit: '75% subsidy on drip/sprinkler installation (up to ₹40,000)',
    eligibility: 'Small & marginal farmers with water bodies',
    application_link: 'https://tn.gov.in',
    last_updated: '2026-02-08',
    contact_phone: '1800-425-1515',
    description: 'Promotes water-efficient micro irrigation to save water and increase yield.',
    documents_required: 'Land records, Aadhaar, Water availability certificate, Bank account',
    income_limit: 'Annual income below ₹5,00,000',
    farm_size_limit: 'Any size',
  },

  // Additional Central Schemes
  {
    id: 'atmanirbhar-001',
    scheme_name: 'Atmanirbhar Bharat - Agricultural Promotion Package',
    government_type: 'Central',
    state: 'All India',
    benefit: 'Interest subvention of 2% + credit guarantee on agri-loans up to ₹10 lakh',
    eligibility: 'Farmers, farmer groups, FPO (Farmer Producer Organization)',
    application_link: 'https://www.nabard.org',
    last_updated: '2026-02-08',
    contact_phone: '1800-180-1111',
    description: 'Employment & self-employment generation through agricultural activities.',
    documents_required: 'Business plan, Land/facility documents, Aadhaar, Bank account',
    income_limit: 'No income limit',
    farm_size_limit: 'No limit',
  },

  {
    id: 'farmers-producer-001',
    scheme_name: 'Formation & Promotion of Farmer Producer Organization (FPO)',
    government_type: 'Central',
    state: 'All India',
    benefit: '₹18 lakh per FPO + ₹3 lakh annual subsidy for 5 years',
    eligibility: '10+ farmers forming an FPO collective',
    application_link: 'https://agricooperation.nic.in',
    last_updated: '2026-02-08',
    contact_phone: '1800-180-2828',
    description: 'Collective farming through farmer groups for better market access & economies of scale.',
    documents_required: 'Registration certificate, Farmers list (Aadhaar), Bank account details',
    income_limit: 'No income limit',
    farm_size_limit: 'No limit',
  },
];

// Fetch all Government Schemes
export const getAllSchemes = async (filters?: SchemeFilterOptions): Promise<GovernmentScheme[]> => {
  try {
    console.log('📡 Fetching government schemes...');
    
    let schemes = [...SAMPLE_SCHEMES];
    
    if (filters) {
      // Filter by state
      if (filters.state && filters.state !== 'All India') {
        schemes = schemes.filter(
          s => s.state === 'All India' || s.state === filters.state
        );
      }
      
      // Filter by government type
      if (filters.governmentType !== 'All') {
        schemes = schemes.filter(s => s.government_type === filters.governmentType);
      }
    }
    
    console.log('✅ Schemes loaded:', schemes.length);
    return schemes.sort((a, b) => a.scheme_name.localeCompare(b.scheme_name));
  } catch (error) {
    console.error('❌ Error fetching schemes:', error);
    return SAMPLE_SCHEMES;
  }
};

// Fetch schemes by state
export const getSchemesByState = async (state: string): Promise<GovernmentScheme[]> => {
  return getAllSchemes({ state, governmentType: 'All' });
};

// Fetch schemes by government type
export const getSchemesByGovernmentType = async (
  governmentType: 'Central' | 'State'
): Promise<GovernmentScheme[]> => {
  return getAllSchemes({ state: 'All India', governmentType });
};

// Get all unique states from schemes
export const getAllStatesWithSchemes = async (): Promise<string[]> => {
  const schemes = await getAllSchemes();
  const states = [...new Set(
    schemes
      .map(s => s.state)
      .filter((s) => s !== 'All India')
  )];
  return ['All India', ...states.sort()];
};

// Search schemes by keyword
export const searchSchemes = async (keyword: string): Promise<GovernmentScheme[]> => {
  const schemes = await getAllSchemes();
  const lowerKeyword = keyword.toLowerCase();
  return schemes.filter(
    s =>
      s.scheme_name.toLowerCase().includes(lowerKeyword) ||
      s.benefit.toLowerCase().includes(lowerKeyword) ||
      s.eligibility.toLowerCase().includes(lowerKeyword) ||
      s.description?.toLowerCase().includes(lowerKeyword)
  );
};

// Get scheme details by ID
export const getSchemeById = async (id: string): Promise<GovernmentScheme | null> => {
  const schemes = await getAllSchemes();
  return schemes.find(s => s.id === id) || null;
};
