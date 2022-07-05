const GamePlay = artifacts.require("GamePlayTest");
//getting it from the json file NewJholeKeta. 
//It hasnt been made.Will be built once compiled


//This is the address of kovan...
module.exports =async function (deployer) {
  await deployer.deploy(GamePlay,1000000000000000n,'0xF82986F574803dfFd9609BE8b9c7B92f63a1410E');
};
