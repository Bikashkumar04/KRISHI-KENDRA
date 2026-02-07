import React from 'react';
import { MandiPrice } from '../services/mandiService.ts';
import { getCommodityEmoji, getCommodityColor } from '../utils/commodityImages.ts';
import './PriceCards.css';

interface PriceCardsProps {
  prices: MandiPrice[];
}

const PriceCards: React.FC<PriceCardsProps> = ({ prices }) => {
  if (prices.length === 0) {
    return null;
  }

  const uniquePrices = Array.from(
    new Map(prices.map(p => [`${p.commodity}${p.market}`, p])).values()
  ).slice(0, 12);

  return (
    <div className="price-cards-section">
      <h3>📋 Mandi Prices</h3>
      <div className="price-cards-grid">
        {uniquePrices.map((price, index) => {
          const emoji = getCommodityEmoji(price.commodity);
          const color = getCommodityColor(price.commodity);
          const minPrice = Number(price.min_price) || 0;
          const maxPrice = Number(price.max_price) || 0;
          const modalPrice = Number(price.modal_price) || 0;

          return (
            <div key={`${price.commodity}-${price.market}-${index}`} className="price-card">
              <div className="card-header" style={{ backgroundColor: `${color}20`, borderLeftColor: color }}>
                <div className="commodity-emoji">{emoji}</div>
                <div className="card-title-section">
                  <h4 className="commodity-name">{price.commodity}</h4>
                  <p className="market-name">{price.market}</p>
                </div>
              </div>

              <div className="card-body">
                <div className="price-row">
                  <span className="price-label">Min Price</span>
                  <span className="price-value min">₹{minPrice.toFixed(2)}/unit</span>
                </div>

                <div className="price-row">
                  <span className="price-label">Max Price</span>
                  <span className="price-value max">₹{maxPrice.toFixed(2)}/unit</span>
                </div>

                <div className="price-row highlight">
                  <span className="price-label">Modal Price</span>
                  <span className="price-value modal">₹{modalPrice.toFixed(2)}/unit</span>
                </div>

                <div className="price-row date-row">
                  <span className="price-label">📅 Date</span>
                  <span className="price-value date">
                    {new Date(price.arrival_date).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="card-footer">
                <span className="state-badge">{price.state}</span>
                <span className="district-badge">🎯 {price.district}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceCards;
