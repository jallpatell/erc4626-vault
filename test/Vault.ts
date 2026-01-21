import { test, describe } from "node:test";
import assert from "node:assert";
import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

describe("ERC4626 Vault Tests", async () => {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  test("should deploy contracts and test vault operations", async () => {

    // Deploy TestToken
    const testToken = await viem.deployContract("TestToken");
    console.log(`TestToken deployed at: ${testToken.address}`);

    // Deploy SimpleVault
    const vault = await viem.deployContract("SimpleVault", [
      testToken.address,
      "Simple Vault Token",
      "SVT"
    ]);
    console.log(`SimpleVault deployed at: ${vault.address}`);

    // Get deployer address
    const [deployer] = await viem.getWalletClients();
    const deployerAddress = deployer.account.address;

    // Initial balances
    const initialBalance = await testToken.read.balanceOf([deployerAddress]);
    console.log(`Initial token balance: ${formatEther(initialBalance)} TEST`);

    // Test 1: Approve tokens for vault
    const approveAmount = parseEther("100");
    const approveTx = await testToken.write.approve([vault.address, approveAmount]);
    await publicClient.waitForTransactionReceipt({ hash: approveTx });
    
    const allowance = await testToken.read.allowance([deployerAddress, vault.address]);
    assert.equal(allowance, approveAmount, "Approval failed");
    console.log(`✓ Approved ${formatEther(approveAmount)} TEST tokens`);

    // Test 2: Deposit tokens to vault
    const depositAmount = parseEther("50");
    const depositTx = await vault.write.deposit([depositAmount, deployerAddress]);
    await publicClient.waitForTransactionReceipt({ hash: depositTx });

    const vaultShares = await vault.read.balanceOf([deployerAddress]);
    const vaultAssets = await vault.read.totalAssets();
    console.log(`✓ Deposited ${formatEther(depositAmount)} TEST, received ${formatEther(vaultShares)} vault shares`);
    console.log(`Total vault assets: ${formatEther(vaultAssets)} TEST`);

    // Test 3: Withdraw tokens from vault
    const withdrawAmount = parseEther("25");
    const withdrawTx = await vault.write.withdraw([withdrawAmount, deployerAddress, deployerAddress]);
    await publicClient.waitForTransactionReceipt({ hash: withdrawTx });

    const finalVaultShares = await vault.read.balanceOf([deployerAddress]);
    const finalVaultAssets = await vault.read.totalAssets();
    const finalTokenBalance = await testToken.read.balanceOf([deployerAddress]);
    
    console.log(`✓ Withdrew ${formatEther(withdrawAmount)} TEST`);
    console.log(`Final vault shares: ${formatEther(finalVaultShares)}`);
    console.log(`Final vault assets: ${formatEther(finalVaultAssets)} TEST`);
    console.log(`Final token balance: ${formatEther(finalTokenBalance)} TEST`);

    // Verify the operations worked correctly
    assert.equal(finalVaultAssets, depositAmount - withdrawAmount, "Vault assets incorrect");
    console.log(`✓ All vault operations completed successfully!`);
  });
});