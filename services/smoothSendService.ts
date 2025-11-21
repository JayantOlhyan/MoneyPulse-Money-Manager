import { SmoothSendResult } from '../types';

/**
 * Simulates the SmoothSendSDK.transfer() method.
 * In a real app, this would interact with the Aptos blockchain via a Relayer.
 */
export const smoothSendTransfer = async (
  recipientAddress: string,
  amount: number,
  token: string = 'USDC'
): Promise<SmoothSendResult> => {
  console.log(`[SmoothSend] Initiating Gasless Transfer...`);
  console.log(`[SmoothSend] To: ${recipientAddress}`);
  console.log(`[SmoothSend] Amount: ${amount} ${token}`);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Simulate validation
  if (!recipientAddress.startsWith('0x')) {
    throw new Error("Invalid Aptos address");
  }

  if (amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  // Return mock success
  return {
    success: true,
    txHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
    feeSaved: 0.0025, // Simulated APT gas saved
    timestamp: Date.now()
  };
};

export const getAptosBalance = async (address: string): Promise<number> => {
  // Simulate fetching balance
  await new Promise(resolve => setTimeout(resolve, 500));
  return 125.00; // Mock USDC balance
};