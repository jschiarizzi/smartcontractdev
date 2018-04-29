module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    azure_node0: {
      host: "",
      port: 8501,
      network_id: "1010",
      gasPrice: 0,
      gas: 500000,
      from: ""
    },
    azure_node1: {
      host: "",
      port: 8502,
      network_id: "1010",
      gasPrice: 0,
      gas: 500000,
      from: ""
    }
  }
};
