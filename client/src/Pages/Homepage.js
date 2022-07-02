import React,{useState,useEffect,useHistory} from 'react'
import DisplayCards from '../components/DisplayCards'
import GameInfo from '../components/GameInfo'
import { Link, Outlet } from "react-router-dom";
function Homepage({contract,web3}) {
    const [activeGames,setActiveGames] = useState(0);
    const [totalGames,setTotalGames] = useState(0);
    const [completedGames,setCompletedGames] = useState(0);
    const [entryFee,setEntreFee] = useState(0);
    
  
    const fetchDatas = async()=>{
        let tempData1 = await contract.methods.totalPlayHouses().call();
        let tempData2 = await contract.methods.active_houses().call();
        let tempData3 = await contract.methods.completed_houses().call();
        let fee = await contract.methods.entryPrice().call();
        fee = web3.utils.fromWei(fee,'ether');
        setTotalGames(tempData1);
        setActiveGames(tempData2);
        setCompletedGames(tempData3);
        setEntreFee(fee);
    }

    const gotocreatePage = ()=>{
        console.log("Go to new page");
       // history.push('/create-new');
    }

    useEffect(()=>{
            fetchDatas();
    },[])

    console.log("totalGAmes", totalGames)
   
  return (
    <div>
         <GameInfo fee={entryFee} activeGames={activeGames} totalGames={totalGames} completedGames={completedGames}/>
         
         <br/>
         <Link to="/create-new">
         <button style={{border:"none",cursor:"pointer",backgroundColor:"blueviolet", padding:"1.5rem 3.5rem",color:"white", fontSize:"20px", outline:"none"}} onClick={gotocreatePage}>
             Create New Game Space
         </button>
         </Link>
         
         <br/>
         
         {
             totalGames>0 && Array(parseInt(totalGames)).fill(0).map((val,index)=>{
                return <DisplayCards key={index} id={index} contract={contract} web3={web3}/>
            })
         }
         
    </div>
  )
}

export default Homepage