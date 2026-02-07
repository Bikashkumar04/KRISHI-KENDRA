import './GovernmentSchemes.css';
import { useState, useEffect } from 'react';
import {
  getAllSchemes,
  getAllStatesWithSchemes,
  searchSchemes,
  GovernmentScheme,
} from '../services/schemeService.ts';

interface SchemeDetailModalProps {
  scheme: GovernmentScheme;
  onClose: () => void;
  onReadAloud: (text: string) => void;
}

function SchemeDetailModal({ scheme, onClose, onReadAloud }: SchemeDetailModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <span className={`scheme-type-badge ${scheme.government_type.toLowerCase()}`}>
            {scheme.government_type === 'Central' ? '🏛️ Central' : '🏘️ State'}
          </span>
          <h2 className="modal-title">{scheme.scheme_name}</h2>
          <button 
            className="read-aloud-btn"
            onClick={() => onReadAloud(
              `${scheme.scheme_name}. Benefit: ${scheme.benefit}. Eligibility: ${scheme.eligibility}. ${scheme.description}`
            )}
            title="Listen to scheme details"
          >
            🔊 Listen
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>💰 Benefit</h3>
            <p className="benefit-text">{scheme.benefit}</p>
          </div>

          <div className="detail-section">
            <h3>✅ Eligibility</h3>
            <p>{scheme.eligibility}</p>
          </div>

          {scheme.description && (
            <div className="detail-section">
              <h3>📝 Description</h3>
              <p>{scheme.description}</p>
            </div>
          )}

          {scheme.documents_required && (
            <div className="detail-section">
              <h3>📄 Documents Required</h3>
              <p>{scheme.documents_required}</p>
            </div>
          )}

          {scheme.income_limit && (
            <div className="detail-section">
              <h3>💵 Income Limit</h3>
              <p>{scheme.income_limit}</p>
            </div>
          )}

          {scheme.farm_size_limit && (
            <div className="detail-section">
              <h3>🌾 Farm Size Limit</h3>
              <p>{scheme.farm_size_limit}</p>
            </div>
          )}

          {scheme.contact_phone && (
            <div className="detail-section">
              <h3>📞 Contact</h3>
              <p>
                <a href={`tel:${scheme.contact_phone}`} className="phone-link">
                  {scheme.contact_phone}
                </a>
              </p>
            </div>
          )}

          {scheme.application_link && (
            <div className="detail-section">
              <h3>🌐 Apply Online</h3>
              <a
                href={scheme.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-button"
              >
                🔗 Visit Official Website
              </a>
            </div>
          )}

          <div className="detail-section last-updated">
            <small>Last updated: {new Date(scheme.last_updated).toLocaleDateString('en-IN')}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function GovernmentSchemes() {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<GovernmentScheme[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('All India');
  const [governmentType, setGovernmentType] = useState<'All' | 'Central' | 'State'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'type'>('name');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const allSchemes = await getAllSchemes();
        const allStates = await getAllStatesWithSchemes();
        setSchemes(allSchemes);
        setStates(allStates);
        applyFilters(allSchemes, 'All India', 'All', '');
      } catch (error) {
        console.error('Error loading schemes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const applyFilters = (
    schemesToFilter: GovernmentScheme[],
    state: string,
    type: 'All' | 'Central' | 'State',
    search: string
  ) => {
    let result = schemesToFilter;

    // Filter by state
    if (state !== 'All India') {
      result = result.filter(s => s.state === 'All India' || s.state === state);
    } else {
      result = result.filter(s => s.state === 'All India' || s.state === state);
    }

    // Filter by government type
    if (type !== 'All') {
      result = result.filter(s => s.government_type === type);
    }

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        s =>
          s.scheme_name.toLowerCase().includes(query) ||
          s.benefit.toLowerCase().includes(query) ||
          s.eligibility.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'type') {
      result.sort((a, b) => a.government_type.localeCompare(b.government_type));
    } else {
      result.sort((a, b) => a.scheme_name.localeCompare(b.scheme_name));
    }

    setFilteredSchemes(result);
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    applyFilters(schemes, state, governmentType, searchQuery);
  };

  const handleTypeChange = (type: 'All' | 'Central' | 'State') => {
    setGovernmentType(type);
    applyFilters(schemes, selectedState, type, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(schemes, selectedState, governmentType, query);
  };

  const handleSortChange = (newSort: 'name' | 'type') => {
    setSortBy(newSort);
    applyFilters(schemes, selectedState, governmentType, searchQuery);
  };

  const readAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Audio support not available on this device');
    }
  };

  return (
    <div className="government-schemes">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">🏛️ Government Schemes & Subsidies</h1>
        <p className="hero-subtitle">Find and apply for agricultural schemes and subsidies</p>
      </section>

      {/* Search & Filter Section */}
      <section className="filter-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search schemes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="filter-container">
          {/* State Filter */}
          <div className="filter-group">
            <label className="filter-label">📍 State</label>
            <select
              className="filter-select"
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Government Type Filter */}
          <div className="filter-buttons">
            <label className="filter-label">Government Type</label>
            <div className="button-group">
              <button
                className={`filter-btn ${governmentType === 'All' ? 'active' : ''}`}
                onClick={() => handleTypeChange('All')}
              >
                All
              </button>
              <button
                className={`filter-btn ${governmentType === 'Central' ? 'active' : ''}`}
                onClick={() => handleTypeChange('Central')}
              >
                🏛️ Central
              </button>
              <button
                className={`filter-btn ${governmentType === 'State' ? 'active' : ''}`}
                onClick={() => handleTypeChange('State')}
              >
                🏘️ State
              </button>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="filter-group">
            <label className="filter-label">Sort by</label>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as 'name' | 'type')}
            >
              <option value="name">Scheme Name</option>
              <option value="type">Government Type</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results Counter */}
      <section className="results-info">
        <p className="results-count">
          📊 Found <strong>{filteredSchemes.length}</strong> scheme{filteredSchemes.length !== 1 ? 's' : ''} for {selectedState}
        </p>
      </section>

      {/* Schemes Grid */}
      <section className="schemes-section">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading schemes...</p>
          </div>
        ) : filteredSchemes.length > 0 ? (
          <div className="schemes-grid">
            {filteredSchemes.map((scheme) => (
              <div key={scheme.id} className="scheme-card">
                <div className="scheme-header">
                  <span className={`scheme-badge ${scheme.government_type.toLowerCase()}`}>
                    {scheme.government_type === 'Central' ? '🏛️' : '🏘️'} {scheme.government_type}
                  </span>
                  <button
                    className="listen-btn"
                    onClick={() => readAloud(scheme.scheme_name)}
                    title="Listen to scheme name"
                  >
                    🔊
                  </button>
                </div>

                <h3 className="scheme-title">{scheme.scheme_name}</h3>

                <div className="scheme-location">
                  📍 {scheme.state}
                </div>

                <div className="scheme-benefit">
                  <span className="label">💰 Main Benefit</span>
                  <span className="value">{scheme.benefit}</span>
                </div>

                <div className="scheme-eligibility">
                  <span className="label">✅ Eligibility</span>
                  <span className="value">{scheme.eligibility}</span>
                </div>

                <div className="scheme-footer">
                  <button
                    className="details-button"
                    onClick={() => setSelectedScheme(scheme)}
                  >
                    📖 View Full Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p className="no-results-emoji">😕</p>
            <h3>No schemes found</h3>
            <p>Try adjusting your search filters or location selection</p>
            <button
              className="reset-button"
              onClick={() => {
                setSelectedState('All India');
                setGovernmentType('All');
                setSearchQuery('');
                applyFilters(schemes, 'All India', 'All', '');
              }}
            >
              🔄 Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedScheme && (
        <SchemeDetailModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          onReadAloud={readAloud}
        />
      )}

      {/* Info Section */}
      <section className="info-section">
        <h2>How to Apply</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-number">1</div>
            <h4>Find Scheme</h4>
            <p>Select your state and search for schemes you're eligible for</p>
          </div>
          <div className="info-card">
            <div className="info-number">2</div>
            <h4>Check Eligibility</h4>
            <p>Review the full details and eligibility criteria carefully</p>
          </div>
          <div className="info-card">
            <div className="info-number">3</div>
            <h4>Collect Documents</h4>
            <p>Gather required documents like Aadhaar, land records, bank details</p>
          </div>
          <div className="info-card">
            <div className="info-number">4</div>
            <h4>Apply Online/Offline</h4>
            <p>Apply through the official website or your nearest government office</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h4>❓ Who is eligible for PM-KISAN?</h4>
            <p>Small and marginal farmers with landholding up to 2 hectares are eligible. Check individual scheme details for other eligibility criteria.</p>
          </div>
          <div className="faq-card">
            <h4>❓ How long does approval take?</h4>
            <p>Processing time varies by scheme (typically 7-30 days). Contact your nearest agricultural office for updates.</p>
          </div>
          <div className="faq-card">
            <h4>❓ Can I apply for multiple schemes?</h4>
            <p>Yes, you can apply for multiple schemes if you meet eligibility criteria. Some schemes may have specific requirements.</p>
          </div>
          <div className="faq-card">
            <h4>❓ What if my application is rejected?</h4>
            <p>You can appeal or reapply after addressing issues. Contact the scheme administration office for detailed guidance.</p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="contact-section">
        <h2>Need Help?</h2>
        <div className="contact-container">
          <div className="contact-card">
            <h4>📞 Agricultural Helpline</h4>
            <p>1800-180-1551</p>
          </div>
          <div className="contact-card">
            <h4>🌐 Official Portal</h4>
            <p>
              <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer">
                pmkisan.gov.in
              </a>
            </p>
          </div>
          <div className="contact-card">
            <h4>📧 Email Support</h4>
            <p>
              <a href="mailto:support@agriculture.gov.in">
                support@agriculture.gov.in
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GovernmentSchemes;
