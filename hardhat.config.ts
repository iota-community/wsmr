import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  etherscan: {
    apiKey:
      {
        shimmerevmtest: "xxx"
      },
    customChains: [
      {
        apikey: "xxx",
        network: "shimmerevmtestnet",
        chainId: 1071,
        urls: {
          apiURL: "https://explorer.evm.testnet.shimmer.network/api",
          browserURL: "https://explorer.evm.testnet.shimmer.network/"
        }
      }
    ]
  },
  networks: {
    shimmerevmtestnet: {
        url: 'https://json-rpc.evm.testnet.shimmer.network',
        chainId: 1071,
        timeout: 60000
    }
  }
};

export default config;
