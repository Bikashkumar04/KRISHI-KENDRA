import React, { useState, useEffect } from 'react';
import SearchFilter from '../components/SearchFilter.tsx';
import PriceCards from '../components/PriceCards.tsx';
import PriceTable from '../components/PriceTable.tsx';
import { getMandiPrices, getCommodities, MandiPrice } from '../services/mandiService.ts';
import './MandiPrice.css';

const MandiPricePage: React.FC = () => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [commodities, setCommodities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Load commodities on mount
  useEffect(() => {
    const loadCommodities = async () => {
      try {
        const comList = await getCommodities();
        setCommodities(comList);
      } catch (err) {
        console.error('Error loading commodities:', err);
      }
    };

    loadCommodities();
  }, []);

  const handleSearch = async (commodity: string, state: string, district: string) => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const results = await getMandiPrices(commodity, state, district);
      
      if (results.length === 0) {
        setError('No results found. Please try a different search.');
        setPrices([]);
      } else {
        setPrices(results);
      }
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError('Failed to fetch mandi prices. Please try again later.');
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mandi-price-page">
      {/* Header */}
      <div className="mandi-header">
        <h1>🏪 Mandi Price Information</h1>
        <p>Latest daily prices from Indian agricultural mandis</p>
        <p className="subtitle">(Real-time market data)</p>
      </div>

      {/* Search & Filter */}
      <SearchFilter 
        commodities={commodities} 
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Info Box */}
      <div className="info-box">
        <div className="info-item">
          <span className="info-icon">ℹ️</span>
          <div>
            <strong>Data Source:</strong> Agmarknet API - Agriculture Department of India
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">📝</span>
          <div>
            <strong>Note:</strong> Agmarknet API provides text-based mandi price data. Commodity images are mapped locally.
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Searching prices...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-state">
          <p className="error-icon">⚠️</p>
          <p className="error-text">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !searched && (
        <div className="empty-state">
          <p className="empty-icon">🔍</p>
          <p className="empty-text">
            Use filters above to search for mandi prices
          </p>
          <p className="empty-subtitle">(Select commodity, state, and district)</p>
        </div>
      )}

      {/* Results */}
      {!loading && prices.length > 0 && (
        <>
          <div className="results-header">
            <h2>📊 Results ({prices.length} results)</h2>
            <p></p>
          </div>

          <PriceCards prices={prices} />
          <PriceTable prices={prices} />
        </>
      )}

      {/* Footer Tips */}
      <div className="mandi-tips">
        <h3>💡 Farming Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">📈</span>
            <strong>Price Analysis:</strong> Market rates often fluctuate between minimum and maximum. Watch trends to find the right time to sell.
          </div>
          <div className="tip-card">
            <span className="tip-icon">🗓️</span>
            <strong>Seasonal Pattern:</strong> Prices drop immediately after harvest. Sell at the right time to get better prices.
          </div>
          <div className="tip-card">
            <span className="tip-icon">📍</span>
            <strong>Local Mandis:</strong> Check mandis in your district. Choose the nearest mandi to save on transportation costs.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandiPricePage;
