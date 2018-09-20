var exec = require('child_process').exec;
var fs = require("fs");
var path = require('path');

const network = process.argv[2];
const contractsDir = "./build/contracts/";

var execCmd = path.normalize("./node_modules/.bin/truffle") + ` deploy --reset --network ${network}`;

console.log("Deploying smart contract...");

exec(execCmd, (error, stdout, stderr) => { 
    console.log(stdout);
    if (error) {
        console.log(error);
        return;
    }
    
    console.log("Generating ABI data for contracts...");
    var contracts = fs.readdirSync(contractsDir);
    for (var i = 0; i < contracts.length; i++) {
        if (contracts[i].endsWith(".json")) {
            var buildInfo = JSON.parse(fs.readFileSync(contractsDir + contracts[i]).toString());
            fs.writeFileSync(contractsDir + contracts[i] + ".abi", JSON.stringify(buildInfo.abi));
            console.log(`Generated ${contractsDir + contracts[i] + ".abi"}`);
        }
    }
});
