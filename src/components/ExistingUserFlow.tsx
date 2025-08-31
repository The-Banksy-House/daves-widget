import { useAccount, useSignMessage } from 'wagmi';
import { readContract, verifyMessage } from '@wagmi/core';
import { config } from '../lib/wagmi';
import { contractAbi, contractAddress } from '../lib/contract';
import { useState } from 'react';
import SuccessView from './SuccessView';

const ExistingUserFlow = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isVerified, setIsVerified] = useState(false);

  const getIsDave = async () => {
    if (!address) return false;
    try {
      const isDave = await readContract(config, {
        address: contractAddress,
        abi: contractAbi,
        functionName: 'isDave',
        args: [address],
      });
      return isDave as boolean;
    } catch (error) {
      console.error('Error checking isDave:', error);
      return false;
    }
  };

  const handleSignMessage = async () => {
    try {
      const isDave = await getIsDave();
      if (!isDave) {
        alert("Sorry, you're not a Dave.");
        return;
      }

      const message = `I am a Dave, and my address is ${address}.`;
      const signature = await signMessageAsync({ message });

      const isSignatureVerified = await verifyMessage(config, {
        address: address!,
        message,
        signature,
      });

      setIsVerified(isSignatureVerified);
    } catch (error) {
      console.error('Signing failed:', error);
      alert('Message signing failed.');
    }
  };

  if (isVerified) {
    return <SuccessView />;
  }

  return (
    <div>
      <h2>Existing User</h2>
      <button onClick={handleSignMessage}>
        Verify You're a Dave by Signing
      </button>
    </div>
  );
};

export default ExistingUserFlow;