const BCCT = artifacts.require("./bcct.sol")

module.exports = function(deployer)
{
	deployer.deploy(BCCT)
};
