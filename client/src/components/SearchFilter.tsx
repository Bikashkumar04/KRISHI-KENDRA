import React, { useState, useEffect } from 'react';
import { getStates, getDistricts } from '../services/mandiService.ts';
import './SearchFilter.css';

interface SearchFilterProps {
  commodities: string[];
  onSearch: (commodity: string, state: string, district: string) => void;
  loading: boolean;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ commodities, onSearch, loading }) => {
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [loadingFilter, setLoadingFilter] = useState(false);

  // Load states on component mount
  useEffect(() => {
    const loadStates = async () => {
      setLoadingFilter(true);
      try {
        const stateList = await getStates();
        setStates(stateList);
      } catch (error) {
        console.error('Error loading states:', error);
      } finally {
        setLoadingFilter(false);
      }
    };

    loadStates();
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (selectedState) {
      const loadDistricts = async () => {
        setLoadingFilter(true);
        try {
          const districtList = await getDistricts(selectedState);
          setDistricts(districtList);
          setSelectedDistrict('');
        } catch (error) {
          console.error('Error loading districts:', error);
          setDistricts([]);
        } finally {
          setLoadingFilter(false);
        }
      };

      loadDistricts();
    } else {
      setDistricts([]);
      setSelectedDistrict('');
    }
  }, [selectedState]);

  const handleSearch = () => {
    onSearch(selectedCommodity, selectedState, selectedDistrict);
  };

  const handleReset = () => {
    setSelectedCommodity('');
    setSelectedState('');
    setSelectedDistrict('');
  };

  return (
    <div className="search-filter">
      <h2>Search Mandi Prices</h2>
      <p className="filter-subtitle">
        Latest prices from Indian mandis
      </p>

      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="commodity">
            <span className="label-icon">🌾</span> Commodity
          </label>
          <select
            id="commodity"
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="filter-input"
            disabled={loading}
          >
            <option value="">Select commodity</option>
            {commodities.map((commodity) => (
              <option key={commodity} value={commodity}>
                {commodity}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="state">
            <span className="label-icon">🗺️</span> State
          </label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="filter-input"
            disabled={loading || loadingFilter}
          >
            <option value="">Select state</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="district">
            <span className="label-icon">📍</span> District
          </label>
          <select
            id="district"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="filter-input"
            disabled={loading || !selectedState || loadingFilter}
          >
            <option value="">Select district</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button 
            onClick={handleSearch} 
            className="btn-primary" 
            disabled={loading || loadingFilter}
          >
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
          <button 
            onClick={handleReset} 
            className="btn-secondary" 
            disabled={loading}
          >
            ↻ Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
