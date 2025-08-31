import { useAccount, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BATCH_MINTER_ABI, BATCH_MINTER_ADDRESS } from '../lib/contracts';

import { NewUserFlow } from './NewUserFlow';
import { ExistingUserFlow } from './ExistingUserFlow';
import { SuccessView } from './SuccessView';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { ErrorMessage } from './shared/ErrorMessage';

type UserState = 'CONNECTING' | 'LOADING' | 'NEW_USER' | 'EXISTING_USER' | 'MINTING' | 'COMPLETED' | 'ERROR';
type Hash = `0x${string}` | undefined;

const MintWidget = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const [userState, setUserState] = useState<UserState>('CONNECTING');
  const [mintTxHash, setMintTxHash] = useState<Hash>(undefined);

  const { data: receipt, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: mintTxHash });

  const { data: eligibilityData, isLoading, error } = useReadContract({
    address: BATCH_MINTER_ADDRESS,
    abi: BATCH_MINTER_ABI,
    functionName: 'getBatchMintEligibility',
    args: [address!],
    enabled: isConnected && !mintTxHash,
  });
  
  useEffect(() => {
    if (isConfirmed) {
      setUserState('COMPLETED');
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (isConnecting) setUserState('CONNECTING');
    else if (mintTxHash) setUserState('MINTING');
    else if (isConnected) {
      if (isLoading) setUserState('LOADING');
      else if (error) setUserState('ERROR');
      else if (eligibilityData) {
        const [, canMintExisting, , alreadyMinted] = eligibilityData;
        if (alreadyMinted) setUserState('COMPLETED');
        else if (canMintExisting) setUserState('EXISTING_USER');
        else setUserState('NEW_USER');
      }
    } else {
      setUserState('CONNECTING');
    }
  }, [isConnected, isConnecting, isLoading, eligibilityData, error, mintTxHash]);

  const handleMintInitiated = (hash: Hash) => {
    if (hash) setMintTxHash(hash);
  };

  const renderContent = () => {
    if (!isConnected) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ConnectButton />
        </div>
      );
    }

    switch (userState) {
      case 'LOADING':
        return <LoadingSpinner message="Checking your status on-chain..." />;
      case 'NEW_USER':
        return <NewUserFlow onMintInitiated={handleMintInitiated} />;
      case 'EXISTING_USER':
        return <ExistingUserFlow onMintInitiated={handleMintInitiated} />;
      case 'MINTING':
        return <LoadingSpinner message="Transaction is confirming..." />;
      case 'COMPLETED':
        return <SuccessView transactionHash={receipt?.transactionHash} />;
      case 'ERROR':
        return <ErrorMessage error="Could not fetch user status. Please refresh and try again." />;
      default:
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ConnectButton />
          </div>
        );
    }
  };

  return (
    <div className="widget-container">
      {renderContent()}
    </div>
  );
};

export default MintWidget;