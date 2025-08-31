import React, { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { NFT_ABI, NFT_ADDRESS } from '../lib/contracts';
import { LoadingSpinner } from './shared/LoadingSpinner';

interface SuccessViewProps {
  transactionHash?: `0x${string}`;
}

export const SuccessView = ({ transactionHash }: SuccessViewProps) => {
  const { address } = useAccount();
  const [nftImage, setNftImage] = useState('');
  
  const NEXT_STEP_URL = "#";
  const SHARE_TEXT = "I just signed the Declaration of the Daves and co-signed the manifesto: The Banksy stays on the wall. #Daves #Base";

  const { data: tokenId } = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'addressToTokenId',
    args: [address!],
    enabled: !!address,
  });

  const { data: tokenUriData, isLoading } = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'tokenURI',
    args: [tokenId!],
    enabled: !!tokenId && tokenId > 0,
  });

  useEffect(() => {
    if (tokenUriData) {
      try {
        const jsonString = atob(tokenUriData.substring(29));
        const metadata = JSON.parse(jsonString);
        setNftImage(metadata.image);
      } catch (e) {
        console.error("Failed to parse tokenURI", e);
      }
    }
  }, [tokenUriData]);

  const { openSeaUrl, farcasterUrl, xUrl } = useMemo(() => {
    const osUrl = `https://opensea.io/assets/base/${NFT_ADDRESS}/${tokenId}`;
    const encodedText = encodeURIComponent(SHARE_TEXT);
    const encodedUrl = encodeURIComponent(osUrl);

    return {
      openSeaUrl: osUrl,
      farcasterUrl: `https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${encodedUrl}`,
      xUrl: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    };
  }, [tokenId]);

  if (isLoading || !nftImage) {
    return <LoadingSpinner message="Loading your NFT..." />;
  }

  return (
    <div className="centered-text">
      <h3>// Mint successful!</h3>
      <p>You have officially co-signed the declaration.</p>
      <img src={nftImage} alt="Your Declaration of the Daves NFT" className="nft-preview" />
      
      <div className="success-actions">
        {transactionHash && (
          <div className="transaction-link">
            Transaction: <a href={`https://basescan.org/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
              {`${transactionHash.substring(0, 6)}...${transactionHash.substring(transactionHash.length - 4)}`}
            </a>
          </div>
        )}
        <div className="share-links">
          <a href={farcasterUrl} target="_blank" rel="noopener noreferrer">Share to Farcaster</a>
          <a href={xUrl} target="_blank" rel="noopener noreferrer">Share to X</a>
          <a href={openSeaUrl} target="_blank" rel="noopener noreferrer">View on OpenSea</a>
        </div>

        <a href={NEXT_STEP_URL} target="_blank" rel="noopener noreferrer" className="action-button next-step-button">
          Proceed to Next Step
        </a>
      </div>
    </div>
  );
};