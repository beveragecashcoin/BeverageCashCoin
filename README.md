# Beverage Cash Coin (BCCT) repository

## Dependencies
Node.js and Python 2.7 are required to run any of the following commands. 
Node.js and npm can be downloaded here: https://nodejs.org/ 
Pyhton can be downloaded here: https://python.org/

To install dependencies for development and deployment, from the project directory run:
```
 > npm install 
 ```
## Deployment
To deploy the smart contract run:

```
 > npm run deploy -- <network>
```
 
 Note: there has to be a space after "--" in this command.

The <network> parameter is used to select a network for deployment. Possible values are:
 - "mainnet" - used for deployment to the main Ethereum network. Connects to a local node that is synced with the mainnet.
 - "ropsten" - used for deployment to the public test network. Connects to a local node that is synced with the Ropsten test network.
 - "private" - Can be used for testing in a private network. Connects to a node running at localhost:8545 with network id - 45 (note: the network id can be changed from the truffle.js config file)
 - "development" - Can be used for development with Ganache. Connects to a node running at localhost:7545

After deployment, the address of the contract will be displayed in the console and ABI files for each contract will be generated:

For example
```
PS D:\BeverageCashCoin> npm run deploy -- private

> BeverageCashCoin@1.0.0 deploy D:\BeverageCashCoin
> node ./scripts/deploy.js "private"

Deploying smart contract...
Compiling .\contracts\Migrations.sol...
Compiling .\contracts\bcct.sol...
Writing artifacts to .\build\contracts

Using network 'private'.

Running migration: 1_deploy_contract.js
  Deploying BCCT...
  ... 0xb8403b6cbee40f1a232806c2342e3caa8ba98e745bd1562f7b0584b115866ac6
  BCCT: 0x1fb649c22d0e08c6721fe5e2aea2f0fade5a63b7
Saving artifacts...

Generating ABI data for contracts...
Generated ./build/contracts/BCCT.json.abi
Generated ./build/contracts/ERC20Interface.json.abi
Generated ./build/contracts/Migrations.json.abi
Generated ./build/contracts/SafeMath.json.abi
```
