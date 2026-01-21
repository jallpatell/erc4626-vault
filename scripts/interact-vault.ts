import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

async function main() {
  // Replace these addresses with your deployed contract addresses
  const TEST_TOKEN_ADDRESS = "0x..."; // Replace with deployed TestToken address
  const VAULT_ADDRESS = "0x..."; // Replace with deployed SimpleVault address

  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [signer] = await viem.getWalletClients();

  console.log(`Using account: ${signer.account.address}`);

  // Get contract instances
  const testToken = await viem.getContractAt("TestToken", TEST_TOKEN_ADDRESS);
  const vault = await viem.getContractAt("SimpleVault", VAULT_ADDRESS);

  // Check initial balances
  const tokenBalance = await testToken.read.balanceOf([signer.account.address]);
  const vaultShares = await vault.read.balanceOf([signer.account.address]);
  
  console.log(`Token balance: ${formatEther(tokenBalance)} TEST`);
  console.log(`Vault shares: ${formatEther(vaultShares)} SVT`);

  // Example operations (uncomment as needed)
  
  // 1. Mint some test tokens (if needed)
  // const mintTx = await testToken.write.mint([signer.account.address, parseEther("1000")]);
  // await publicClient.waitForTransactionReceipt({ hash: mintTx });
  // console.log("✓ Minted 1000 TEST tokens");

  // 2. Approve vault to spend tokens
  // const approveTx = await testToken.write.approve([VAULT_ADDRESS, parseEther("100")]);
  // await publicClient.waitForTransactionReceipt({ hash: approveTx });
  // console.log("✓ Approved 100 TEST tokens for vault");

  // 3. Deposit tokens to vault
  // const depositTx = await vault.write.deposit([parseEther("50"), signer.account.address]);
  // await publicClient.waitForTransactionReceipt({ hash: depositTx });
  // console.log("✓ Deposited 50 TEST tokens to vault");

  // 4. Withdraw tokens from vault
  // const withdrawTx = await vault.write.withdraw([parseEther("25"), signer.account.address, signer.account.address]);
  // await publicClient.waitForTransactionReceipt({ hash: withdrawTx });
  // console.log("✓ Withdrew 25 TEST tokens from vault");
}

main().catch(console.error);