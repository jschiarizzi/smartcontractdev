# Introduction
This guide will walkthrough the application development lifecycle of a smart contract in the context of Ethereum.  This includes the use of various tools and steps to:

* Create a new smart contract
* Compiling the smart contract locally using Truffle
* Deploy the smart contract locally on a developer's machine
* Interact with the smart contract locally to test basic functionality
* Moving beyond the developers workstation to a the Ropsten testnet
  * Running a local (light) node for Ropsten
  * Creating an account to interface with Ropsten
  * Funding this account with test ether for transaction use
  * Using Truffle to interact with Ropsten
    * Migrating a smart contract to the testnet from truffle
    * Interacting with smart contract on Ropsten testnet
  * Using Ethereum Wallet to interact with the smart contract on the Ropsten testnet
    * Registring the contract
    * Performing transactions

-----
## Smart Contracts 101

Smart contracts allow coding of logic and state flows in an Ethereum blockchain.  As with most software development, there are various stages to building and deploying the development artifacts, and a variety of tools that can be leveraged to increase developer productivity.

First, the creation of a new smart contract project.  [Truffle](http://truffleframework.com) is a widely popular tool for assisting in the lifecycle of projects.  To get started using Truffle, you will need to simply install the nodejs package.  Truffle does not contain an IDE by itself.  A variety of lightweight development/scripting IDEs can be used.  In this walkthrough, we will use [VSCode](https://code.visualstudio.com/).

### Step 1 - Install VSCode and Solidity extension
1. Navigate to https://code.visualstudio.com/ and download the product based on you operating system (*this demo was built on Windows 10*).
2. Navigate to https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity and install this extension for VSCode.

### Step 2 - Install GIT
1. Navigate to https://git-scm.com/downloads and download the version based on hyour operating system (*this demo was built on Windows 10*)
`NOTE: For Windows installation, the default options for installation works well, with the exception of choosing Git bash only when prompted for the command line experience.`

### Step 3 - Install NodeJS and Truffle
1. Navigate to https://nodejs.org/ and download the latest product (LTS) based on your operating system (*this demo was build on Windows 10*).  This will install nodejs and npm (package manager)
2. Install truffle by running the following command: `npm install truffle -g` 
<br/>(*this will require administrative permissions because it will be a global node package*)

### Step 4 - Initialize terminal in VSCode
1. Start VSCode.
2. Press the <CTRL> + ~ key to launch an integrated terminal window.
3. A prompt in the lower left corner will allow you to customize the defaults for the terminal.  Click `Customize` and select Git Bash from the options.

### Step 5 - Creating your first Truffle project and smart contract
1. Start VSCode (if its not already running)
2. Open the terminal window (<CTRL> + ~)
3. In the terminal window type
```
mkdir MyProject
cd MyProject
truffle init
```
4. Now open the new project you have created.  Click the File menu, Open Folder and select the folder created in Step3 (named MyProject).  You will see a series of folder (contracts, migrations, etc.)
5. Right click on the contracts folder and click New File.  Name the file Storage.sol.
6. Add the following code to the empty file that was created
```
pragma solidity ^0.4.23;

contract Storage {
    uint storedData;

    constructor() public {
        storedData = 7;
    }

    function get() public view returns (uint){
        return storedData;
    }

    function set(uint newVal) public {
        storedData = newVal;
    }
}
```
7. Type <CTRL> + S to save this file.

### Step 6 - Compiling, deployment and function testing of smart contracts
1. Now that our first contract is created, the first step that should be done is validating that our syntax is correct and we have a valid smart contract that can be deployed to a blockchain.  To do this, navigate back to the terminal window (if its not open use <CTRL> + ~ to toggle it open).  Next enter the following command to compile the contract.
```
truffle compile
```
`NOTE: Truffle framework will find the solidity files and compile them.`

2. The output of the compile will be to the interactive terminal windows, including Errors or Warnings from the compiler.  Additionally a build folder will be created at the root of the project.  For each smart contract in the project, a new file will be created that contains.
* The ABI for the contract - ABI is the application binary interface which describes how to integrate/call the contract.
* The compiled bytecode that will be signed and submitted as a transaction to the blockchain.
* Mapping for step through debugging options.
* The address that the smart contract will be deployed to.
3. Now that the smart contract has been compiled the next step would be to run the smart contract and interact with the functions and contained state to ensure the basic opertions are functioning correctly.  To do this we need to define a migration in Truffle to tell Truffle how to deploy the contract.  To start right click on the migrations folder and click Add File.  Name the file `2_deploy_contracts.js`.
4. In the new file created add the following code.
```
var Storage = artifacts.require('./Storage');

module.exports = function(deployer) {
    deployer.deploy(Storage);
};
```
`NOTE: Truffle will deploy/migrate all migrations in the migrations folder in order by the number in the file name (1, 2, 3, ...)`

5. Save the file by typing <CTRL> + S.
6. Next the migration will be run locally.  Truffle includes a "in memory" blockchain (Ganache) that will offer a Ethereum compatible interface with a very small footprint.  This is ideal for developers that are looking to test basic functionally before deploying these assets to more concrete blockchains instances in staging, production, etc.  To deploy to this developer blockchain run the following.
```
truffle develop
migrate
```
7.  At this point, the contracts will be deployed to the in memory blockchain in Truffle.  Next, a developer will likely want to test the basic functionality of the contract.  For the contract that was deployed some initial state was created in the constructor and two functions were created to write an updated state and retrieve the current state.
8.  To retrieve the current state we can call it directly, thanks to Truffle.
```
Storage.deployed().then((i) => { return i.get.call() })
```
9.  This will return the following result, the key element to pay attention to is the last value of 7 which was set in the constructor.
```
BigNumber { s: 1, e: 0, c: [ 7 ] }
```
10.  Next, run the folllowing command to have Truffle call the set method to change the state of the contract.  This will change the state from 7 to 42.
```
Storage.deployed().then((i) => { return i.set(42) })
```
11.  This will return the following result.  This is a signed transaction, which are asynchronous.  The various blockchain information including the transaction hash, blocknumber, etc is returned.
```
{ tx: '0x61b05df23a9826a6c23af046fc8a2081250477ebd18f4b8aae12ccd4df1279e4',
  receipt:
   { transactionHash: '0x61b05df23a9826a6c23af046fc8a2081250477ebd18f4b8aae12ccd4df1279e4',
     transactionIndex: 0,
     blockHash: '0x2c290be5b95b9632c2cd3afaf7ef383c6751e6c39197c3f9f8748d3927322769',
     blockNumber: 7,
     gasUsed: 26669,
     cumulativeGasUsed: 26669,
     contractAddress: null,
     logs: [],
     status: '0x01',
     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' },
  logs: [] }
  ```

12.  Lastly, run the following command to have Truffle call the get method to ensure our state change in fact happened.
```
Storage.deployed().then((i) => { return i.get.call() })
```
13.  This will return the following result, the key element to pay attention to is the last value of 42, which is what step 10 set.

### Step 7 - Moving beyond the developers workstation to Ropsten testnet
After basic testing on the developers workstation is completed, another step could be to deploy to a public testnet.  This test network is provided in addition to the public Ethereum network.  The goal is to deploy the assets (smart contracts) to a blockchain closer to production (public Ethereum), without the risk and cost of real money.

1.  To get started, Truffle will need to be made aware of the public testnet via its configuration.  Open the `truffle.js` at the root of project and replace the contents of the file with this.
```
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      network_id: 3,
      host: "localhost",
      port: 8545,
      gas: 2900000
    }
  }
};
```
2.  This is configuring Truffle to continue to use the local development "in memory" blockchain for development and adds a new entry for Ropsten (the current public test network).

`NOTE: The ropsten configuration is using localhost and port 8545.  A local geth node will run that truffle with use to communicate with the public testnet.` 

3.  Next we need to setup a local geth (go-ethereum) node so that Truffle can interface with the test network.  To start first, down the the latest version of geth from https://geth.ethereum.org/downloads/.  Choose the appropriate package based on your operation system.  

`NOTE: In this walkthrough we are demonstrating Windows 10, so select this package ->` https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-1.8.7-66432f38.zip

4.  After downloading the geth binary, extract to any folder on your system.  
`NOTE:  C:\users\<your user name>\Downloads is a good spot!`

5.  Open a command prompt (outside of VSCode) to the folder where this binary was placed in step 4.  Next run the following:
```
geth --testnet account new
```
6.  This will prompt for a password and then return a big number, which is the address of the account that was created.  This will be used to sign transactions on the testnet.  Save this address returned as it will be used later. (copy/paste to notepad :) )

7.  To perform transactions on the testnet, ether will be needed to full the compute nodes.  This is not "real" ether such as on public Ethereum network, but is still required.  The account created in step 6 will have 0 ether by default.  A faucet has been created that will allow 1 ether to be transferred to any account.  Navigate to http://faucet.ropsten.be:3001/ and paste the address from step 6 (be sure to append 0x to the number)

8.  It will take a few seconds for the transaction to completed and the 1 ether to show up in the account balance.  Before we come back to this, we can now start our geth node (listener) that will communicate to the testnet.  To start this run the following from the command line started in step 5.
```
geth --testnet --syncmode light --cache 1024 --rpc --rpcapi eth,net,web3,personal
```
9.  This will run geth and a series of initialization steps will scroll by on the window.  The node will then sync to the current testnet.  This typically will take a few minutes.

`NOTE: Do NOT close this window`

10.  Next start another command prompt to the directory used in step 5 and this time run the following command.
```
geth attach http://localhost:8545
```

11.  This will attach to the first command prompt running the interface to the testnet.  You can now check that balance of your account to see if the ether has transferred.  This can be done by running the following command.
```
web3.fromWei(eth.getBalance(eth.accounts[0]), "ether")
```

12.  This command will return 0 until the faucet funds the account.  When it is funded it will return 1.  Congrats you have 1 fake ether now.  Actually this is important for us to deploy and interact with contracts on the testnet.

13.  The last step we need to do is unlock the account so it can be used to sign transactions.  To do this run the following command in the same command window.
```
personal.unlockAccount(eth.accounts[0], "<the password you gave this account>", 500)
```

14.  This command will return true when done correctly and will remain unlocked for 8 minutes.  Next move back to VSCode, and in the terminal window, stop the current Truffle develop session by typing CTRL + C (twice).  Next type the following to target the testnet, Ropsten.
```
truffle console --network ropsten
```

15.  This will leave a command prompt `truffle(ropsten)>`.  Next right click on the build folder and delete the entire folder.  Then move back to the `truffle(ropsten)>` in the terminal window and type.
```
migrate
```

16.  This will compile and deploy the contracts in your project to the Ropsten test network.  This will take a few seconds to complete, please be patient. :)  Once the deploymet is complete, the contracts can be tested, just as was done locally.
```
Storage.deployed().then((i) => { return i.get.call() }) 
Storage.deployed().then((i) => { return i.set(42) })
Storage.deployed().then((i) => { return i.get.call() })
```

17. The first result will be 7 as before, then a transaction will be created for the set (state change to 42) and then it will return 42 to the last get.  Congrats you have run actual transactions on a public testnet!

### Step 8 - Interacting with Ropsten based smart contract via Ethereum Wallet
Lastly, you might want to interact with the smart contracts that were deployed to Ropsten via something other than Truffle.  One client that makes this easy is the [Etheruem Wallet](https://github.com/ethereum/mist/releases/download/v0.10.0/Ethereum-Wallet-win64-0-10-0.zip).  

1.  Download this (for this walkthrough we are using the Windows 64 bit version, other binaries are available for other platforms [here](https://github.com/ethereum/mist/releases)).

2.  After downloading, extract this and start the Ethereum Wallet.exe contained within.

3.  Because a geth node is already running from the previous section, this exe will attach to this running process.  After the wallet starts up, the interface will show the single account that was created above, with the Ether contained within.

4.  To add our contract and use this wallet to perform transactions simply first click on Contracts Icon in the top right of the window (to the left of the account balance).

5.  Next scroll down until the Watch Contracts icon if visible.  Click on this.  The interface will prompt for 3 values.  
* The target smart contract address
* The target smart contract name
* The target smart contract abi

6.  The address can be found by going back to VSCode and navigating to the build folder and to the json file for the contract that you would like to attach to the wallet.  For our case this would be Storage.json.  Click on this file to open it.  Scroll to the very bottom of the file and look for the network section and specifically for network 3 (Ropsten).  Under this there will be an address node.  This is the deployed smart contract address.  Copy and paste this in the Ethereum wallet for target smart contract address.
```
"networks": {
    "3": {
      "events": {},
      "links": {},
      "address": "0xcb43ed1622dc0fba822a16b5bf51afb7f2ee1a14",
      "transactionHash": "0x6fcc1771dabc4c5b7b90cdda5313a27ae1f7d5b9593ec4be571fb6dc6b8a9681"
    },
```
 
7.  Next add `Storage` as the smart contract name for the next field.

8.  Lastly, go back to the json file open in VSCode and copy the ABI.  It's at the top of the in an array.
```
[
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "get",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newVal",
          "type": "uint256"
        }
      ],
      "name": "set",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  ```

9.  Paste this in the last form field in the Ethereum Wallet.  Then click ok.  That's it.  Now when you click on this contact in this section (named Storage), it will return the current state and on the right side you can click the drop down for functions.  There will be only one for this contract named Set.  A value can be added here and it will prompt for the password to sign the transaction with.  