#### Step 1 - Install VSCode and Solidity extension
1. Navigate to https://code.visualstudio.com/ and download the product based on you Operating system (*this demo was built on Windows 10*).
2. Navigate to https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity and install this extension for VSCode.

#### Step 2 - Install NodeJS and Truffle
1. Navigate to https://nodejs.org/ and download the latest product (LTS) based on your operating system (*this demo was build on Windows 10*).  This will install nodejs and npm (package manager)
2. Install truffle by running the following command: `npm install truffle -g` 
<br/>(*this will require administrative permissions because it will be a global node package*)

#### Step 3 - Create the Ethereum backend network (single vm / multi node)
1. Create an Azure VM with Ubuntu 16.04LTS base operating system -> [here](https://portal.azure.com/#create/Canonical.UbuntuServer1604LTS-ARM)
2. After the VM is provisioned, run the following:
  1. Modify the NSG to open port 8501 and 8502.
  2. Install Go Ethereum (latest) ->
```
    sudo apt-get install software-properties-common
    sudo add-apt-repository -y ppa:ethereum/ethereum
    sudo apt-get update
    sudo apt-get install ethereum
```
  3. Create a directory for the network and 2 nodes -> 
```
    mkdir deveth
    cd deveth
    mkdir node1 node2
```
  4. Create accounts for each node (*you will be prompted for a passphase, use **test**)*->
```
    geth --datadir node1/ account new
    geth --datadir node2/ account new
```
  5. After you run each command above, provide a passphrase, an address will generated.  We will save them for use later.
``` 
    echo '<your address for node 1 >> accounts.txt
    echo '<your address for node 2 >> accounts.txt
```
  6. Create a password file with the password used above (**test**)
```
    echo 'test' > password.txt
```
  7. Create a new genesis file for blockchain initialization.  This can be created a variety of ways but the latest geth include puppeth to automate this process with a wizard.  Follow the steps contained below.
```
Please specify a network name to administer (no spaces, please)
> deveth
What would you like to do? (default = stats)
 1. Show network stats
 2. Configure new genesis
 3. Track new remote server
 4. Deploy network components
> 2
Which consensus engine to use? (default = clique)
 1. Ethash - proof-of-work
 2. Clique - proof-of-authority
> 2
How many seconds should blocks take? (default = 15)
> 5 // for example
Which accounts are allowed to seal? (mandatory at least one)
> 0x0000 //copy paste from account.txt 
> 0x0000
Which accounts should be pre-funded? (advisable at least one)
> 0x0000 // free ethers !
> 0x0000
Specify your chain/network ID if you want an explicit one (default = random)
> 1010 
Anything fun to embed into the genesis block? (max 32 bytes)
>
What would you like to do? (default = stats)
 1. Show network stats
 2. Manage existing genesis
 3. Track new remote server
 4. Deploy network components
> 2
1. Modify existing fork rules
 2. Export genesis configuration
> 2
Which file to save the genesis into? (default = devnet.json)
> genesis.json
INFO [04-28|12:00:01] Exported existing genesis block
What would you like to do? (default = stats)
 1. Show network stats
 2. Manage existing genesis
 3. Track new remote server
 4. Deploy network components
> ^C // ctrl+C to quit puppeth
```
  8. Next we will need to initialize the local database on the nodes for ethereum.
```
geth --datadir node1/ init genesis.json
geth --datadir node2/ init genesis.json
```
  9. Next create a bootkey for the bootnode on the network (for bootstrapping new nodes)
```
bootnode -genkey boot.key
```
  10. Now we are finally ready to start the bootnode.
``` 
bootnode -nodekey boot.key -verbosity 9 -addr 127.0.0.1:30310
```
  11. Lastly we will start our geth nodes on both (node1/node2)
```
geth --datadir node1/ --syncmode 'full' --port 30311 --rpc --rpcaddr '0.0.0.0' --rpccorsdomain '*' --rpcport 8501 --rpcapi 'personal,db,eth,net,web3,txpool,miner' --bootnodes 'enode:/<this number will come from the bootnode after it starts>@127.0.0.1:30310' --networkid 1010 --gasprice '0' --unlock '<account address for node1>' --password password.txt --mine

geth --datadir node2/ --syncmode 'full' --port 30312 --rpc --rpcaddr '0.0.0.0' --rpccorsdomain '*' --rpcport 8502 --rpcapi 'personal,db,eth,net,web3,txpool,miner' --bootnodes 'enode://<this number will come from the bootnode after it starts>@127.0.0.1:30310' --networkid 1010 --gasprice '0' --unlock '<account address for node2>' --password password.txt --mine
```
In case you do not get the enode hex number when bootnode starts you can extract it with this
```
bootnode --nodekeyhex <nodekey> -writeaddress
```
