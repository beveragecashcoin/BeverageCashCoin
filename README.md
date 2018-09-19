# Beverage Cash Coin (BCCT) repository

## Dependencies
Node.js is required to run any of the following commands. Node.js and npm can be downloaded here: https://nodejs.org/ 

To install dependencies for development and deployment, from the project directory run:
```
 > npm install 
 ```
## Deployment
To deploy the smart contract on windows run:
```
 > npm run deploy-windows -- <network>
 ```
 On linux: 
 ```
 > npm run deploy-linux -- <network>
 ```

The <network> parameter can be used to select a network for deployment. Possible values are:
 - "mainnet" - used for deployment to the main Ethereum network. Connects to a local node that is synced with the mainnet.
 - "ropsten" - used for deployment to the public test network. Connects to a local node that is synced with the Ropsten test network.
 - "private" - Can be used for testing in a private network. Connects to a node running at localhost:8545 with network id - 45
 - "development" - Can be used for development with Ganache. Connects to a node running at localhost:7545
 
After deployment, the address of the contract will be displayed in the console:

For example
```
 > .\node_modules\.bin\truffle deploy --reset --network "private"
Using network 'private'.

Running migration: 1_deploy_contract.js
  Deploying BCCT...
  ... 0xe24a1330e518ccce101b58fda8b67f398e8c8eed32ae10c69c0c246cdb5230b2
  BCCT: 0x11be395a2277db3d764df26376f77c7f80939227
Saving artifacts...
```
