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
    deployer.deploy(StoredState);
};
```
9. To deploy the contract, simple run the following commands:
```
truffle develop
migrate
```
10. Now you have Ganache running (a blockchain in memory), and you have deployed a smart contract, StoredState, to this chain.  Next we will do some light testing to ensure the contract actually works.  To start we will retrieve the current state, which should be a single unsigned integer set to 7.  To do this run the following command:
```
StoredState.deployed().then((i) => { return i.get.call() })
```
This should return this
```
BigNumber { s: 1, e: 0, c: [ 7 ] }
```
This validates that 7 is actually stored in the contract.
11.  Next we will change this value (update the state), with a simple transaction.  To do this run the following command:
```
StoredState.deployed().then((i) => { return i.set(42) })
```
When this is executed a transaction has been created to update the state.  The output will be similar to this.
```
{ tx: '0xa12ec414ec02382dc8eefd144335660c621d64dcd8d6d0b89c36d613c583a47e',
  receipt:
   { transactionHash: '0xa12ec414ec02382dc8eefd144335660c621d64dcd8d6d0b89c36d613c583a47e',
     transactionIndex: 0,
     blockHash: '0xad04012a2f940ce36fba4cc6b72e354815315bc58d77f3ce5a71d69032d6d26d',
     blockNumber: 5,
     gasUsed: 26669,
     cumulativeGasUsed: 26669,
     contractAddress: null,
     logs: [],
     status: '0x01',
     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' },
  logs: [] }
  ```
  12.  Now we can validate the state change by calling the getter function again.
  ```
  StoredState.deployed().then((i) => { return i.get.call() })
  ```
  This will output the updated state.
  ```
  BigNumber { s: 1, e: 1, c: [ 42 ] }
  ```
  13.  Finally we will want to now share this with others and publish to a blockchain beyond our local development machine.  To do this we will need to modify the truffle configuration to target our external private blockchain.  First open the truffle.js, remove the existing contents and replace with the snippet below.
  ```
  module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    azure_node0: {
      host: "<your VM external ip>",
      port: 8501,
      network_id: "1010",
      gasPrice: 0,
      gas: 500000,
      from: "<your address for node 1>"
    },
    azure_node1: {
      host: "<your VM external ip>",
      port: 8502,
      network_id: "1010",
      gasPrice: 0,
      gas: 500000,
      from: "<your address for node 2>"
    }
  }
};
```
14. Next we will run the migrate using the following command:
```
truffle migrate --network azure_node0
```
After a few seconds you should see the deployment of these resources to the Ethereum node running in Azure.  The output will look similar to this:
```
Using network 'azure_node0'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0xbb79bf9e51bd5ca3c237216892e941eba495b19512e655d298e426450f120ad7
  Migrations: 0x890090d0d40496017359b0adb4bf100d181b90b2
Saving successful migration to network...
  ... 0xd608e33298ccd719c6c3be80316b59ffd37cceb70c22cac1dcedeb3e0a0d152c
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying StoredState...
  ... 0x2a48dfd0a9f28a81bb60ab4b6d8e5e32da027b4ae8a0a2edb39955e9dacecd59
  StoredState: 0x39efc074df02799b380ff29a603303d1fc9ea9b2
Saving successful migration to network...
  ... 0x1ccd92ac6881b7ddc9d5aba680af0a375ceb2e2149abc10a31a2269de2b704bb
Saving artifacts...
```
15. These smart contracts can be interacted with the same as the local development we did above.  To do this, run the following command.
```
truffle console --network azure_node0
```
Then deployed contracts can be accessed like we did previously.
```
StoredState.deployed().then((i) => { return i.get.call() })
```
-----
(_Optional_) : Debugging exceptions
<br/>
Debugging smart contracts is unique because the shared compute resources are used to execute the smart contract code.  Essentially we can setup a debugging environment to trap exceptions and then replay the failing transaction and step through this line by line to help in debugging the flaw.

1. First we need to create an exception.  For this demo we will simulate a infinate loop in our code.  Update the `StoredData.sol` contract to use this code (_note the infinite loop in the set function_)
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
        while (true) {
            storedData = newVal;
        }
    }
}
```
2. Now delete the `build` folder at the root of the folder structure.
3. Next run truffle dev in _log_ mode on a terminal session.
```
truffle dev --log
```
4. Create another terminal session and start another truffle dev session (you should see it attach to the other session that is logging our output).
```
truffle dev
```
5. Next in this session, run the migration
```
migrate 
```
6. Now we need to hit the bug, so call the set method.
```
StoredState.deployed().then((i) => { return i.set(42) })
```
7. After a few seconds you will get an exception, if you look closely you will see the exception is out of gas error.
8. Now navigate back to the first terminal (that was logging output).  Copy the transaction hash from the last transaction.
9. Navigate back to the second terminal session, where the method was called and enter the following
```
debug <paste your tx hash here>
```
10. Next hit the ENTER key a few times to step into the code and as you hit enter noticed the you end up in an endless loop.  This shows how you can debug basic exceptions using the tx debugger.  If you hit the P key on any break, you will see the instructions used on the EVM and the low level data (assembly).