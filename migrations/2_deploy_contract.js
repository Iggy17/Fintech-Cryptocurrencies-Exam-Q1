var CoShoeToken = artifacts.require("CoShoeToken");

// initialisations
var totalSupply = 100;
var shoesSold = 0;


module.exports = function (deployer) {
    // Deploy the CoShoeToken contract
    deployer.deploy(CoShoeToken, totalSupply, shoesSold);
};
