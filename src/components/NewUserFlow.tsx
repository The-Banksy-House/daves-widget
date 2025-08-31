import React, { useState, useMemo, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { BATCH_MINTER_ABI, BATCH_MINTER_ADDRESS } from '../lib/contracts';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { ErrorMessage } from './shared/ErrorMessage';

type Hash = `0x${string}` | undefined;

interface NewUserFlowProps {
  onMintInitiated: (hash: Hash) => void;
}

export const NewUserFlow = ({ onMintInitiated }: NewUserFlowProps) => {
  const [daveName, setDaveName] = useState('');
  const debouncedDaveName = useDebounce(daveName, 500);

  const { data: availability, isLoading: isCheckingName } = useReadContract({
    address: BATCH_MINTER_ADDRESS,
    abi: BATCH_MINTER_ABI,
    functionName: 'isNameAvailable',
    args: [debouncedDaveName.toLowerCase()],
    enabled: !!debouncedDaveName,
  });

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  useEffect(() => {
    if (hash) {
      onMintInitiated(hash);
    }
  }, [hash, onMintInitiated]);

  const handleSignAndMint = () => {
    const mintPrice = parseEther('0.00303');
    const valueWithBuffer = mintPrice + (mintPrice * 20n / 100n);

    writeContract({
      address: BATCH_MINTER_ADDRESS,
      abi: BATCH_MINTER_ABI,
      functionName: 'signAndMint',
      args: [daveName.toLowerCase()],
      value: valueWithBuffer,
    });
  };
  
  const validationMessage = useMemo(() => {
    if (!debouncedDaveName) return '';
    if (isCheckingName) return <span className="status-checking">// Checking availability...</span>;
    if (availability) {
      const [isAvailable, reason] = availability;
      return isAvailable 
        ? <span className="status-available">// Name available!</span>
        : <span className="status-unavailable">// {reason}</span>;
    }
    return '';
  }, [debouncedDaveName, isCheckingName, availability]);

  const isValid = availability?.[0] && daveName.length > 0;

  if (isPending) return <LoadingSpinner message="Please confirm in your wallet..." />;

  return (
    <div>
      <p className="comment-color">// Choose your Dave name to co-sign.</p>
      <div className="input-group">
        <span className="input-prefix">i_am_</span>
        <input
          type="text"
          className="dave-input"
          value={daveName}
          onChange={(e) => setDaveName(e.target.value.replace(/[^a-z0-9-]/gi, ''))}
          placeholder="your-name"
          maxLength={14}
        />
        <span className="input-prefix">_dave</span>
      </div>
      <div className="validation-message">{validationMessage}</div>
      <button 
        className="action-button" 
        disabled={!isValid || isPending}
        onClick={handleSignAndMint}
      >
        Sign and Mint (0.00303 ETH)
      </button>
      {error && <ErrorMessage error={error.message} />}
    </div>
  );
};