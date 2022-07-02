const GamePlay = artifacts.require("GamePlayTest");
//getting it from the json file NewJholeKeta. 
//It hasnt been made.Will be built once compiled
module.exports =async function (deployer) {
  await deployer.deploy(GamePlay,10000000000000000n);
};
