module.exports = {
  networks: {
    "development": {
        host: "localhost",
        port: 7545,
        network_id: "*"
    },
    "mainnet": {
        network_id: 1
    },
    "ropsten": {
        network_id: 3
    },
    "private": {
        host: "localhost",
        port: 8545,
        network_id: 45
    }
  }
};
