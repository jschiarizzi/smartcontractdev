var StoredState = artifacts.require('./StoredState.sol');

module.exports = function(deployer){
    deployer.deploy(StoredState);
};