import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VaultModule = buildModule("VaultModule", (m) => {
  const testToken = m.contract("TestToken");
  
  const vault = m.contract("SimpleVault", [
    testToken,
    "Simple Vault Token",
    "SVT"
  ]);

  return { testToken, vault };
});

export default VaultModule;