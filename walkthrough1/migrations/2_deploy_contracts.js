var StoredState = artifacts.require('./StoredState');

module.exports = function(deployer){
    deployer.deploy(StoredState);
};