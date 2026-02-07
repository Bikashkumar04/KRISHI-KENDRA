import React, { useState } from 'react';
import { MandiPrice } from '../services/mandiService.ts';
import './PriceTable.css';

interface PriceTableProps {
  prices: MandiPrice[];
}

type SortField = 'commodity' | 'market' | 'modal_price' | 'arrival_date';
type SortOrder = 'asc' | 'desc';

const PriceTable: React.FC<PriceTableProps> = ({ prices }) => {
  const [sortField, setSortField] = useState<SortField>('modal_price');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  if (prices.length === 0) {
    return null;
  }

  const sortedPrices = [...prices].sort((a, b) => {
    let aValue: any = a[sortField as keyof MandiPrice];
    let bValue: any = b[sortField as keyof MandiPrice];

    if (['modal_price', 'min_price', 'max_price'].includes(sortField)) {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="price-table-section">
      <h3>📋 Detailed Price Table</h3>
      
      <div className="table-wrapper">
        <table className="price-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('commodity')} className="sortable">
                Commodity {getSortIcon('commodity')}
              </th>
              <th>State</th>
              <th onClick={() => handleSort('market')} className="sortable">
                Market {getSortIcon('market')}
              </th>
              <th>Min Price</th>
              <th>Max Price</th>
              <th onClick={() => handleSort('modal_price')} className="sortable highlight">
                Modal Price {getSortIcon('modal_price')}
              </th>
              <th onClick={() => handleSort('arrival_date')} className="sortable">
                Date {getSortIcon('arrival_date')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPrices.map((price, index) => (
              <tr key={`${price.commodity}-${price.market}-${index}`} className={index % 2 === 0 ? 'even' : 'odd'}>
                <td className="bold">{price.commodity}</td>
                <td>{price.state}</td>
                <td>{price.market}</td>
                <td className="price-min">₹{Number(price.min_price).toFixed(2)}</td>
                <td className="price-max">₹{Number(price.max_price).toFixed(2)}</td>
                <td className="price-modal bold highlight">
                  ₹{Number(price.modal_price).toFixed(2)}
                </td>
                <td className="date">
                  {new Date(price.arrival_date).toLocaleDateString('hi-IN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>Total Markets: {prices.length}</p>
      </div>
    </div>
  );
};

export default PriceTable;
