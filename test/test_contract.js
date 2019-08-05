const CoShoeToken = artifacts.require('./CoShoeToken.sol')

contract("CoShoeToken", function(accounts) {
    var tokenSaleInstance;
    const admin = accounts[0];
    const adminName = "Egnatious Phiri";
    const imgurl = "www.dummyurl.com" // dummy url of image on shoe
    var buyer = accounts[1];
    var numberOfTokens; // number of shoe tokens

    const price = web3.utils.toWei('0.5', 'ether'); //price of each shoe token

    // this is the initial shoe
    const baseShoe = {
        name: adminName,
        image: imgurl,
        sold: false,
        price: web3.utils.toWei('0.5', 'ether')
    }

    it('initializes the contract with the correct values', function(){
      return CoShoeToken.deployed().then(function(instance) {
        tokenSaleInstance = instance;
        return tokenSaleInstance.address
      }).then(function(address) {
      assert.notEqual(address, 0x0, 'has contract address');
      return tokenSaleInstance.getPrice();
    }).then(function(tokenPrice) {
      assert.equal(tokenPrice, price, 'token price is set correctly');
      return tokenSaleInstance.shoesSold();
    }).then(function(soldShoes) {
      assert.equal(soldShoes, 0x0, 'initializes number of shoes sold to zero');
      return tokenSaleInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply, 0x64, 'mints 100 tokens');
    });
  });

  it('facilitates the purchasing of shoe token', function() {
    return CoShoeToken.deployed().then(function(instance) {
      tokenInstance = instance;
  }).then(function(instance){
      return tokenSaleInstance.buyShoe(baseShoe.name, baseShoe.image, {from: buyer, value: price})
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Purchase', 'should be the "purchase" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._value, price, 'logs the price paid for the token');
      return tokenSaleInstance.buyShoe(baseShoe.name, baseShoe.image, {from: buyer, value: 1})
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0, 'msg.value must equal price of token in wei');
    });
  });

  it('determine the correct number of shoes purchased in boolean array', function() {
    return CoShoeToken.deployed().then(function(instance) {
      tokenInstance = instance;
  }).then(function(instance){
      return tokenSaleInstance.buyShoe(baseShoe.name, baseShoe.image, {from: buyer, value: price})
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Purchase', 'should be the "purchase" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._value, price, 'logs the price paid for the token');
      return tokenSaleInstance.checkPurchases()
    }).then(function(purchaseArray) {
      assert.equal(purchaseArray[0], "true", 'purchase array has correct number of trues');
    });
  });
})
