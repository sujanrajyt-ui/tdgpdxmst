require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.20",
    networks: {
        testnet: {
            url: "https://testnetrpc.mstblockchain.com",
            chainId: 4545,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        mainnet: {
            url: "https://mariorpc.mstblockchain.com",
            chainId: 4646,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
};
