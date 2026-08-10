import React from 'react';
import { HowToUse } from '../components/HowToUse';

export const HowToUsePage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">How to Use</h1>
          <p className="page-subtitle">Step-by-step guide to get the most out of RupeeFlow</p>
        </div>
      </div>
      <HowToUse />
    </div>
  );
};