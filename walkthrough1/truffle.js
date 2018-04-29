module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    azure_node0: {
      host: "40.70.9.93",
      port: 8501,
      network_id: "1010",
      gasPrice: 0,
      gas: 500000,
      from: "0x1d1907b41ea11ffb9881de78872b8cd350e4c799"
    },
    azure_node1: {
      host: "40.70.9.93",
      port: 8502,
      network_id: "1010",
      gasPrice: 0,
      gas: 500000,
      from: "0xef68c0e6c047e910305411bdeb60879ccbce7a5a"
    }
  }
};