// SPDX-License-Identifier: GPL-3.0
// import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
// import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */



contract GamePlayTest  {

    uint public entryPrice;
    address  payable public contractOwner;
    uint public active_houses; 
    uint public completed_houses; 
    


  

    struct PlayHouse{
        string housename;
        string gameDescription;
        uint bettingPrice;
        uint totalPool;
        uint totalEntries;
        bool isActive;
        address creator;
        address winner;
        address[] entries;
        mapping(address => bool)  isInGame;
        mapping (address => bool) hasConfirmedToProceed;
        uint totalApprovals;
        uint gasUsed;
    }
    //here house id will map to individual playHouse
    mapping(uint => PlayHouse) playhouses;
    uint public totalPlayHouses; 
   

    modifier only_owner(uint playHouseId){
        require( playhouses[playHouseId].creator==msg.sender);
        _;
    }
    modifier only_contract_creator(){
        require( msg.sender==contractOwner);
        _;
    }

    constructor(uint _entryPrice){
        contractOwner = payable(msg.sender);
        entryPrice = _entryPrice;
    }

    function getApprovalCount(uint _hid) public view returns(uint){
      return  playhouses[_hid].totalApprovals;
    }
    

    function createPlayHouse(string memory _name , string memory _description ,uint _bettingPrice) public payable{
            
            
            require(msg.value>=(_bettingPrice+entryPrice));


            PlayHouse storage p1 =  playhouses[totalPlayHouses];
            p1.housename = _name;
            p1.gameDescription = _description;
            p1.bettingPrice = _bettingPrice;
            p1.creator = msg.sender;
            p1.isActive = true;
            p1.isInGame[msg.sender] = true; 
            p1.totalPool += _bettingPrice; 
            p1.totalEntries++;
            p1.entries.push(msg.sender);
            totalPlayHouses++;
            active_houses++;
          
    }


    

    function getPlayHouseDatas(uint playHouseId) public view returns(
        string memory _name ,
        string memory _description ,
        address _creator ,
        uint _poolPrice,
        bool isActive,
        uint bettingPrice,
        address[] memory players,
        address _winner
        ){
          PlayHouse storage p5 =  playhouses[playHouseId];
        return(
        p5.housename,
        p5.gameDescription,
        p5.creator,
        p5.totalPool,
       p5.isActive, 
       p5.bettingPrice, 
       p5.entries,
       p5.winner
       );

    }

    function entry(uint _playHouseId) public payable{

        address _newPlayer = msg.sender;
            
            require(playhouses[_playHouseId].isActive);
            require(msg.value >(playhouses[_playHouseId].bettingPrice+entryPrice),'Insufficient entry price');
            require( !playhouses[_playHouseId].isInGame[_newPlayer],'Player is already in the game');
            require(playhouses[_playHouseId].entries.length==1 );

               playhouses[_playHouseId].entries.push(msg.sender);
        playhouses[_playHouseId].totalPool += playhouses[_playHouseId].bettingPrice; 
        playhouses[_playHouseId].totalEntries++;
        playhouses[_playHouseId].isInGame[msg.sender]=true;


    }

    function withdraw() public only_contract_creator payable only_contract_creator{
       uint currentBalance= address(this).balance;
        payable(contractOwner).transfer(currentBalance);
    } 
    
    function getContractBalance() public only_contract_creator view returns(uint) {
        return (address(this).balance);
    } 

    function cancelGame(uint _playhouseId) public payable{
        require (playhouses[_playhouseId].creator == msg.sender);
        require(playhouses[_playhouseId].totalEntries==1);
        require(playhouses[_playhouseId].isActive);
        playhouses[_playhouseId].isActive = false;
        payable(msg.sender).transfer(entryPrice+playhouses[_playhouseId].bettingPrice);
        
    }

    function getGasUsed(uint _playHouseId) public view returns(uint){
        return  playhouses[_playHouseId].gasUsed;
    }

    function startGame(uint _playHouseId) public {
         require (playhouses[_playHouseId].creator == msg.sender);
         playhouses[_playHouseId].totalApprovals = 1;
         playhouses[_playHouseId].hasConfirmedToProceed[msg.sender] = true;
    }
   

    function approveByOtherPlayer(uint _playHouseId,uint randomNum) public{
        PlayHouse storage p3 =  playhouses[_playHouseId];
        require(p3.isInGame[msg.sender]);
        require(!p3.hasConfirmedToProceed[msg.sender]);
         p3.hasConfirmedToProceed[msg.sender] = true;
        p3.totalApprovals +=1;

        pickWinner(_playHouseId,randomNum);

         
    }

    function changeEntryPrice(uint _entryPrice) public only_contract_creator{
            entryPrice = _entryPrice;
    }
    function leaveGame(uint _playHouseId) public payable{
        
        PlayHouse storage p2 =  playhouses[_playHouseId];
        require(p2.isInGame[msg.sender]);
        
        require(p2.isActive);
        p2.isInGame[msg.sender] = false;
        p2.totalEntries = p2.totalEntries-1;
        if(p2.creator==msg.sender){
            address _secondPerson = p2.entries[1]; 
            p2.winner=_secondPerson;
            p2.isActive = false;
            payable(_secondPerson).transfer(p2.totalPool);
        }else{
            p2.isInGame[msg.sender]=false;
            
            //Here, for the coin flip, we give out the result almost instantly,, 
            //but for others game, user may leave game before its completion... soooo

            if(p2.hasConfirmedToProceed[msg.sender]){
                p2.hasConfirmedToProceed[msg.sender] = false;
                p2.totalApprovals -=1;

            }

        }

    }

    function pickWinner (uint _homeId,uint _index) public payable{

       PlayHouse storage p4 =  playhouses[_homeId];
       require(getApprovalCount(_homeId)==2);
       address _winnerAddress = p4.entries[_index];
       p4.winner = _winnerAddress;
       p4.isActive = false;
       active_houses--;
       completed_houses++;
       payable(_winnerAddress).transfer(p4.totalPool);
    }


}