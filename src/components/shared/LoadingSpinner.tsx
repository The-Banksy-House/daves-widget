import React from 'react';

export const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="loading-container">
    <p>{message}</p>
  </div>
);