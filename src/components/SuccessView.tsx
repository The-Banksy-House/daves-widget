import { useAccount, useBalance, useReadContract } from 'wagmi';
import { contractAddress, contractAbi } from '../lib/contract';
import { formatEther } from 'viem';

const SuccessView = () => {
  const { address } = useAccount();

  const { data: balance } = useBalance({
    address,
    query: {
        enabled: !!address,
    }
  });

  const { data: daveCount } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'daveCount',
    query: {
        enabled: !!address,
    }
  });

  return (
    <div>
      <h2>Success!</h2>
      <p>Address: {address}</p>
      {balance && <p>Balance: {formatEther(balance.value)} ETH</p>}
      {daveCount !== undefined && <p>Total Daves: {daveCount.toString()}</p>}
    </div>
  );
};

export default SuccessView;