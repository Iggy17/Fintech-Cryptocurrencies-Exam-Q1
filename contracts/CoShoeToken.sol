pragma solidity^0.5.0;

contract CoShoeToken {
    address admin;

    // variable initialisation
    string public name = "CoShoeToken";
    string public symbol = "CO";
    uint256 private tokenPrice;
    uint256 public shoesSold;
    uint256 public count;
    uint256 public totalSupply;


    // creates the representational stuct of shoe (the token)
    struct Shoe {
        string name; //name of owner of shoe
        address payable owner; //address of the owner of the shoe token
        string image; //image url
        bool sold;
    }

    // array to hold the shoes
    Shoe[]  shoeArray;

    // event declarations
    event Purchase(
      address indexed _buyer,
      uint256 _value
    );

    // create tokens and initialize price
    constructor(uint256 _initialSupply, uint256 _shoesSold) public {
        // set constructor arguments
        admin = msg.sender;
        totalSupply = _initialSupply;
        tokenPrice = 5*10**17; // 0.5 ETH converted to wei
        shoesSold = _shoesSold;

        for (uint i = 1; i <= totalSupply; i++) {
        shoeArray.push(Shoe("",msg.sender,"",false));
        }
    }

    //function for purchasing shoe tokens
    function buyShoe(string memory _name, string memory _imgurl) public payable returns(uint){

        // validation checks
        //require that the number of shoe tokens to be purchased are less than the number of shoe tokens minted (check there are still shoes available)
        require(shoesSold < shoeArray.length, "No more remaining tokens. Please specify a number less than the remaining amount");
        // require that the value of the transactions is equivalent to the value of the shoes to be purchased (check that exactly ETH is being provided)
        require(msg.value == tokenPrice, "The value of the purchase does not equal the price. Please specify the correct price (0.5 ETH)");

        //sell the next shoe token
        uint256 i = shoesSold + 1;

        //ensure that the token has not already been purchased
        require(shoeArray[i].sold == false,'This token has already been purchased.');

        // update the values of the next shoe
        // set the owner of the token to the caller of the function
        shoeArray[i].owner = msg.sender;
        // register the token to the owners identifer
        shoeArray[i].name = _name;
        // set the token image to the supplied image url
        shoeArray[i].image = _imgurl;
        // register the token as sold
        shoeArray[i].sold = true;
        // increment the number of tokens that have been sold
        shoesSold++;

        // emit the purchase event
        emit Purchase(msg.sender, msg.value);

        // finally return the number of shoes that have been sold
        return shoesSold;
    }

    // getter functions
    function getPrice() public view returns(uint _tokenPrice) {
        return tokenPrice;
    }

    // setter functions
    function setPrice(uint256 _newPrice) public returns(uint256) {
        require(msg.sender == admin);
        tokenPrice = _newPrice;
    }


    // test functions
    function tokenCount() public view returns(uint counts) {
        return shoeArray.length;
    }
    //function to return an array of bools of an array of all the purchases that are true
    function checkPurchases() external view returns (bool[] memory){
        bool[] memory checkPurchase;
        for (uint256 i = 0; i < shoeArray.length; i++){
            if (shoeArray[i].owner == msg.sender){
                checkPurchase[i] = true;
            }
            else {
              checkPurchase[i] = false;
            }
        }
        return checkPurchase;
    }

}
