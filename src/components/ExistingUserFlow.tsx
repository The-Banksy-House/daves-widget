import React, { useState, useEffect } from 'react';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
import { parseEther, readContract } from 'viem';
import { BATCH_MINTER_ADDRESS, BATCH_MINTER_ABI, DECLARATION_ADDRESS, DECLARATION_ABI } from '../lib/contracts';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { ErrorMessage } from './shared/ErrorMessage';

type Hash = `0x${string}` | undefined;

interface ExistingUserFlowProps {
  onMintInitiated: (hash: Hash) => void;
}

export const ExistingUserFlow = ({ onMintInitiated }: ExistingUserFlowProps) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [isSearching, setIsSearching] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const { data: hash, error, isPending, writeContract } = useWriteContract();
  
  useEffect(() => {
    if (hash) {
      onMintInitiated(hash);
    }
  }, [hash, onMintInitiated]);
  
  const findSignatureNumber = async (): Promise<number | null> => {
    if (!publicClient || !address) return null;
    
    const totalSignatures = await readContract(publicClient, {
      address: DECLARATION_ADDRESS,
      abi: DECLARATION_ABI,
      functionName: 'totalSignatures',
    });

    const batchSize = 100;
    for (let i = 0; i < totalSignatures; i += batchSize) {
      const promises = [];
      const limit = Math.min(i + batchSize, Number(totalSignatures));
      for (let j = i; j < limit; j++) {
        promises.push(
          readContract(publicClient, {
            address: DECLARATION_ADDRESS,
            abi: DECLARATION_ABI,
            functionName: 'signatures',
            args: [BigInt(j)],
          })
        );
      }
      const signatures = await Promise.all(promises);
      const foundIndex = signatures.findIndex(sig => sig[1].toLowerCase() === address.toLowerCase());

      if (foundIndex !== -1) {
        return i + foundIndex + 1;
      }
    }
    return null;
  };

  const handleRetroactiveMint = async () => {
    setIsSearching(true);
    setLookupError('');
    try {
      const signatureNumber = await findSignatureNumber();
      if (signatureNumber) {
        const mintPrice = parseEther('0.00303');
        const valueWithBuffer = mintPrice + (mintPrice * 20n / 100n);
        
        writeContract({
          address: BATCH_MINTER_ADDRESS,
          abi: BATCH_MINTER_ABI,
          functionName: 'mintExisting',
          args: [BigInt(signatureNumber)],
          value: valueWithBuffer,
        });

      } else {
        setLookupError("Could not find your signature in the declaration.");
      }
    } catch (e: any) {
      setLookupError(`An error occurred during lookup: ${e.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  if (isSearching) return <LoadingSpinner message="Searching for your signature on-chain..." />;
  if (isPending) return <LoadingSpinner message="Please confirm in your wallet..." />;

  return (
    <div className="centered-text">
      <h3>// Welcome back, Dave.</h3>
      <p>Your signature has been found. Mint your NFT to finalize your commitment.</p>
      <button 
        className="action-button"
        onClick={handleRetroactiveMint}
        disabled={isPending}
      >
        Mint My NFT (0.00303 ETH)
      </button>
      {lookupError && <ErrorMessage error={lookupError} />}
      {error && <ErrorMessage error={error.message} />}
    </div>
  );
};