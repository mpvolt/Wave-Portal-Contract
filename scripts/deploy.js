// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const main = async () => {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const WavePortalContract = await hre.ethers.getContractFactory("WavePortal");
  const [owner] = await hre.ethers.getSigners();
  const waveContract = await WavePortalContract.deploy({ value: hre.ethers.utils.parseEther("0.001"),});

  await waveContract.deployed();
  
  console.log("Contract Deployed!");
  console.log("Contract address: ", waveContract.address);
  console.log("Deployed by: ", owner.address);  
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async () =>{
	try{
		await main();
		process.exit(0);
	}
	catch(error){
		console.error(error);
		process.exit(1);
	}
};

runMain();
