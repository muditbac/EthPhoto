pragma solidity ^0.4.7;

import "./stl.sol";

contract SimpleStorage {
  uint public storedData;
  struct name {
    string s;
    uint8 t;
  }

  name[] public a;
  name[] public b;

  function SimpleStorage(uint initialValue) {
    storedData = initialValue;
    name memory test;
    test.s = "Hola";
    test.t = 100;
    a.push(test);
    a.push(test); // Each copy of test is saved as each element of array
    b.push(test);
    a[0].s = "Bhola";
  }


  function change() returns (uint256){
    delete a[0];
    a[1].s = "gola";
    return a.length;
  }

  function set(uint x) {
    storedData = x;
  }

  function get() constant returns (uint retVal) {
    return storedData;
  }

  function getSize() constant returns (uint) {
    return a.length;
  }

}
