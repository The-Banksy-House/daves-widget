import React from 'react';

export const ErrorMessage = ({ error }: { error: string }) => {
  const parseError = (errMsg: string): string => {
    if (errMsg.includes('Name already taken')) return 'This DAVE name has already signed.';
    if (errMsg.includes('insufficient funds')) return 'Insufficient funds for transaction.';
    if (errMsg.includes('User rejected the request')) return 'Transaction was rejected in your wallet.';
    if (errMsg.includes('Signature number does not belong to caller')) return 'Error: The signature number found does not match this wallet.';
    return errMsg;
  };

  return (
    <div className="error-container">
      <p>Error:</p>
      <p>{parseError(error)}</p>
    </div>
  );
};