import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
    console.log("🚀 Deploying Product Passport contracts to MST network...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MSTC\n");

    // 1. ProductPassportRegistry
    const PassportRegistry = await ethers.getContractFactory("ProductPassportRegistry");
    const passportRegistry = await PassportRegistry.deploy();
    await passportRegistry.waitForDeployment();
    const passportAddr = await passportRegistry.getAddress();
    console.log("✅ ProductPassportRegistry deployed:", passportAddr);

    // 2. OwnershipRegistry
    const OwnershipRegistry = await ethers.getContractFactory("OwnershipRegistry");
    const ownershipRegistry = await OwnershipRegistry.deploy();
    await ownershipRegistry.waitForDeployment();
    const ownershipAddr = await ownershipRegistry.getAddress();
    console.log("✅ OwnershipRegistry deployed:", ownershipAddr);

    // 3. AttestationRegistry
    const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
    const attestationRegistry = await AttestationRegistry.deploy();
    await attestationRegistry.waitForDeployment();
    const attestationAddr = await attestationRegistry.getAddress();
    console.log("✅ AttestationRegistry deployed:", attestationAddr);

    // 4. ServiceRegistry
    const ServiceRegistry = await ethers.getContractFactory("ServiceRegistry");
    const serviceRegistry = await ServiceRegistry.deploy();
    await serviceRegistry.waitForDeployment();
    const serviceAddr = await serviceRegistry.getAddress();
    console.log("✅ ServiceRegistry deployed:", serviceAddr);

    // 5. LifecycleRegistry
    const LifecycleRegistry = await ethers.getContractFactory("LifecycleRegistry");
    const lifecycleRegistry = await LifecycleRegistry.deploy();
    await lifecycleRegistry.waitForDeployment();
    const lifecycleAddr = await lifecycleRegistry.getAddress();
    console.log("✅ LifecycleRegistry deployed:", lifecycleAddr);

    console.log("\n🎉 All contracts deployed successfully!\n");
    console.log("=== Add to .env.local (Vite contract addresses) ===");
    console.log(`VITE_MST_PRODUCT_PASSPORT_REGISTRY=${passportAddr}`);
    console.log(`VITE_MST_OWNERSHIP_REGISTRY=${ownershipAddr}`);
    console.log(`VITE_MST_ATTESTATION_REGISTRY=${attestationAddr}`);
    console.log(`VITE_MST_SERVICE_REGISTRY=${serviceAddr}`);
    console.log(`VITE_MST_LIFECYCLE_REGISTRY=${lifecycleAddr}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
