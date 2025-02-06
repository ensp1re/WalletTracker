export default () => ({
  api: process.env.API,
  etherscan: process.env.ETHERSCAN_API,
  moralis: process.env.MORALIS_API,
  networks: {
    ethereum: {
      rpcUrl: process.env.ETHEREUM_RPC_URL,
    },
    bnb: {
      rpcUrl: process.env.BNB_RPC_URL,
    },
    arbitrum: {
      rpcUrl: process.env.ARBITRUM_RPC_URL,
    },
    optimism: {
      rpcUrl: process.env.OPTIMISM_RPC_URL,
    },
    base: {
      rpcUrl: process.env.BASE_RPC_URL,
    },
    linea: {
      rpcUrl: process.env.LINEA_RPC_URL,
    },
  },
});
