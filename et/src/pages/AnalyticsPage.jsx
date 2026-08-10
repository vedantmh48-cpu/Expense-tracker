import React from 'react';
import { AnalyticsCharts } from '../components/AnalyticsCharts';

export const AnalyticsPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Deep dive into your spending patterns</p>
        </div>
      </div>
      <AnalyticsCharts />
    </div>
  );
};