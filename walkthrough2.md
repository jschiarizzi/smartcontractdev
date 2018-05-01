1. Open VSCode and open a terminal window (`CTRL + ~`) <br/>__NOTE: GitBash works best for this ;)__
2. Initialize a new project for truffle
```
truffle init
```
3. This will create folder and base templates files for a new project that will serve as a base.  For the initial development, build and test we will use a built in Ethereum blockchain called Ganache to allow rapid development (instant transactions).  To get started, create a new smart contract to show storing state and retrieving state.  This is a simple example but demonstrates the most core operations of the blockchain.
4. In the contract folder (if you are using bash command line, `cd contracts`), create a new file named `StoredState.sol`
5. Now we need to add some code to this file.  Add the following code snippet
```
pragma solidity ^0.4.23;

contract StoredState {
    uint storedData;

    function StoredState() public {
        storedData = 7;
    }

    function get() public view returns (uint) {
        return storedData;
    }

    function set(uint newVal) public {
        storedData = newVal;
    }
}
```
6. Next, we can compile this contract by running the following command.  Compilation will simply validate the syntax of the contract and create 2 output (binary and abi).  These can be found in the build folder after succesful compilation.
```
truffle compile
```
7. Next, we will want to deploy these contracts to a blockchain to start testing them.  In order to do this, we will write a deployment artifact to tell truffle how to deploy the contract.  To start, create a new file in the migrations folder named `2_deploy_contracts.js`
8. Open this file and add the following code snippet which will describe how to deploy the contract.
```
var StoredState = artifacts.require('./StoredState.sol');

module.exports = function(deployer){
    deployer.deploy(StoredState, {privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]});
};
```
This will setup the migration so that only the node creating the contract (node1) and the nodes public keys that are passed as the last parameter to the transaction (optional array parameter).  In this example node7's public key will included.
9. To deploy the contract, simple run the following commands:
```
truffle console --network node1
migrate
```
10. Now you have deployed a smart contract, StoredState, to this chain.  Next we will do some light testing to ensure the contract actually works.  To start we will retrieve the current state, which should be a single unsigned integer set to 7.  To do this run the following command:
```
StoredState.deployed().then((i) => { return i.get.call() })
```
This should return this
```
BigNumber { s: 1, e: 0, c: [ 7 ] }
```
11. Next we will check if node2 can read this data, which is should **NOT** be able to do because it's public key was not included when the transaction was submitted (contract created).
```
HIT CTRL + C (two times)
truffle console --network node2
StoredState.deployed().then((i) => { return i.get.call() })
```
This should return 0 (can't read the value):
```
BigNumber { s: 1, e: 0, c: [ 0 ] }
```
12. Next will check if node7 can read this data, which is should be able to do because it's public key was included when the transaction was submitted (contract created)
```
HIT CTRL + C (two times)
truffle console --network node7
StoredState.deployed().then((i) => { return i.get.call() })
```
This should return the same output as node1
```
BigNumber { s: 1, e: 0, c: [ 7 ] }
```
This proves that transactions details can be hidden and exposed only to nodes that are privy to the information.