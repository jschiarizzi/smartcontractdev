pragma solidity ^0.4.23;

contract StoredState {
    uint storedData;

    function StoredState() public {
        storedData = 7;
    }

    function get() public view returns (uint) {
        return storedData;
    }

    function set(uint newVal) public {
        storedData = newVal;
    }
}