import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useReadContract } from 'wagmi';
import { isEnsName } from 'viem';
import { normalize } from 'viem/ens';
import { contractAddress, contractAbi } from '../lib/contract';

const NewUserFlow = () => {
  const [ensName, setEnsName] = useState('');
  const debouncedEnsName = useDebounce(ensName, 500);

  const { data: isAlreadyDave, isLoading } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'isDave',
    args: [debouncedEnsName ? normalize(debouncedEnsName) : ''],
    query: {
      enabled: !!debouncedEnsName && isEnsName(debouncedEnsName),
    }
  });

  return (
    <div>
      <h2>New User</h2>
      <input
        type="text"
        placeholder="Enter ENS name"
        value={ensName}
        onChange={(e) => setEnsName(e.target.value)}
      />
      {isLoading && <p>Checking...</p>}
      {isAlreadyDave && <p>{ensName} is already a Dave!</p>}
    </div>
  );
};

export default NewUserFlow;