// Standard Template Library

pragma solidity ^0.4.0;

contract owned {
    address public owner;

    modifier onlyOwner() {
        if (msg.sender == owner) {
            _;
        }
    }

    function owned() {
        owner = msg.sender;
    }

    function transferOwnership(address _owner) onlyOwner{
        owner = _owner;
    }
}

contract mortal is owned {
    function kill() {
        if (msg.sender == owner)
            selfdestruct(owner);
    }
}