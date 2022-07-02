import React,{useState,useEffect} from 'react'

import { useParams } from "react-router-dom";
import useEth from "../contexts/EthContext/useEth";
function IndividualGame() {

  const [loading,setLoading] = useState(false);
  const [gameLoading,setGameLoading] = useState(false);
  const [totalApproval,setTotaApproval] = useState(0);
  const [isCreator,setIsCreator] = useState(false);
  const [gameData,setGameData] = useState();
  const [entryFee,setEntryfee] = useState(0);

 
  let {id} = useParams();

  console.log(id);
   const { state } = useEth();
 
 
   const fetchData = async(id)=>{
     setLoading(true);

     let tempGameData = await state.contract.methods.getPlayHouseDatas(id).call();
     let tempApprovalData = await state.contract.methods.getApprovalCount(id).call();
     let _entryFee = await state.contract.methods.entryPrice().call();
     setGameData(tempGameData);
      setTotaApproval(tempApprovalData);
      setEntryfee(_entryFee);
      
      console.log(tempGameData)
      setLoading(false);

  }

  const checkCreator = (datas)=>{
      if(state.accounts[0]===datas._creator){
        setIsCreator(true);
      }
      else{
        setIsCreator(false);
      }
  }

  const joinGame = async()=>{
    console.log("Join game");
    let _bettingPrice = gameData.bettingPrice;
    setGameLoading(true);
    let _total = (parseInt(_bettingPrice)+parseInt(entryFee))+10000;
    await state.contract.methods.entry(id).send({
      from:state.accounts[0],
      value:_total
    });
    fetchData(id);
    setGameLoading(false);

  }
  const startGame = async()=>{
    console.log("Start game");
    setGameLoading(true);
    setTotaApproval(1);
    await state.contract.methods.startGame(id).send({
      from:state.accounts[0]
    });
    setGameLoading(false);

  }
  const approveToStart = async()=>{
    console.log("Approve toStart game");
    setGameLoading(true);
    let randomNum = Math.floor((Math.random() * 2) );
    await state.contract.methods.approveByOtherPlayer(id,randomNum).send({
        from:state.accounts[0]
    });
    fetchData(id);
   

    
    setGameLoading(false);
  }

  useEffect(()=>{
    fetchData(id)
    
  },[])
  useEffect(()=>{
    if(gameData )
    checkCreator(gameData)
    
  },[state.accounts[0],gameData]);

  
  
  return (
    <div>
      <h2>
        {gameData && gameData._name}
      </h2>
      <br/>
      {gameData && gameData._description}
      <br/><br/>
      Welcome <b>{state.accounts[0]}</b> into the game space.<br/>
      <br/>
        <h4>Rules (Things to note)</h4>
        <ul>
          <li>
            If you join the game, you will be sending the <b>(betting amount + entry fee)</b> to contract. The person that wins takes all of the pool prize.
          </li>
          <li>
            After participation of 2 players, creator is required to start the game which will be approval from the creator side
          </li>
          <li>
           After approval from creator, the second player needs to approve the game to start.
          </li>
          <li>
            If creator leaves the game while there are no other players, creator will be refunded but will have to  pay the gas fee
          </li>
          <li>
            If creator leaves the game while there are  other players, the second player will be declared winner
          </li>
          <li>
            If second player leaves the game, the player wont be refunded
          </li>
        </ul>
        <br/><br/>
      {
        loading ?
        <h2 style={{padding:"3rem 0",textAlign:"center"}}>
          Loading......
        </h2>
        :
        <>
        
      Betting Price - <b> {gameData && state.web3.utils.fromWei(gameData.bettingPrice,'ether')} eth</b><br/><br/>
      Current Pool  - <b> {gameData && state.web3.utils.fromWei(gameData._poolPrice,'ether')} eth</b><br/><br/>
      Creator - <b>{gameData && gameData._creator}</b><br/><br/>
      Participants - {gameData && gameData.players.map(data=>{
        return <div style={{display:"inline-block", padding:"0.25rem 0.75rem",fontSize:"14px", border:"1px solid black" , borderRadius:"6px",marginRight:"0.5rem"}}>
        {data}
        </div>
      }) }

{
  gameData && gameData.isActive ?
  <div>
        <br/>
        {
          isCreator && gameData &&
          <>
              {
                gameData.players.length == 1 &&
                <>
                  Waiting for another playerr.......<br/><br/>
                  </>
              }
            <button  onClick={startGame} disabled={gameData.players.length!=2 || gameLoading ||totalApproval>0}>
              Start Game
            </button>

          
          </>
        }
        {
           !isCreator && gameData && 
           <>
           {
             gameData.players.includes(state.accounts[0])?

             <>
             Wait for creator to start Game !!! <br/>
               <button onClick={approveToStart} disabled={totalApproval==0 || gameLoading}>
                  Approve to start game
               </button>
             </>
             :
          <button onClick={joinGame} disabled={gameLoading || gameData.players.length==2}>
            Join the Game
          </button>
           }
          

        
           </>
        }
          
      </div>
    :
    <div><br/>
      Winner : <b>{gameData && gameData._winner} </b>
    </div>
}
    
        </>
      }



    </div>
  )
}

export default IndividualGame