// Contract Addresses (To be updated when NFT and Batch contracts are deployed)
export const DECLARATION_ADDRESS = '0xB0731E7ea189c169640Fd890E5dcE9811040D0eA';
export const NFT_ADDRESS = '0x...YOUR_NFT_CONTRACT_ADDRESS'; // <--- DEPLOY AND PASTE ADDRESS HERE
export const BATCH_MINTER_ADDRESS = '0x...YOUR_BATCH_MINTER_ADDRESS'; // <--- DEPLOY AND PASTE ADDRESS HERE

// Declaration Contract ABI (Partial)
export const DECLARATION_ABI = [
  { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "signatures", "outputs": [{ "internalType": "string", "name": "daveName", "type": "string" }, { "internalType": "address", "name": "signatory", "type": "address" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }, { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalSignatures", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
] as const;

// NFT Contract ABI (Partial)
export const NFT_ABI = [
  { "inputs": [], "name": "MINT_PRICE", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "addressToTokenId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }
] as const;

// Batch Minter Contract ABI (Partial)
export const BATCH_MINTER_ABI = [
  { "inputs": [{ "internalType": "string", "name": "daveName", "type": "string" }], "name": "signAndMint", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "signatureNumber", "type": "uint256" }], "name": "mintExisting", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "daveName", "type": "string" }], "name": "isNameAvailable", "outputs": [{ "internalType": "bool", "name": "available", "type": "bool" }, { "internalType": "string", "name": "reason", "type": "string" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getBatchMintEligibility", "outputs": [{ "internalType": "bool", "name": "canSignAndMint", "type": "bool" }, { "internalType": "bool", "name": "canMintExisting", "type": "bool" }, { "internalType": "bool", "name": "alreadySigned", "type": "bool" }, { "internalType": "bool", "name": "alreadyMinted", "type": "bool" }, { "internalType": "string", "name": "status", "type": "string" }], "stateMutability": "view", "type": "function" }
] as const;