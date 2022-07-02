import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
function DisplayCards({id,contract,web3}) {
 
    const clickCard = (id)=>{
        console.log("Clicked", id);
        navigate(`/game/${id}`);
    }

    const [data,setData] = useState();
    const [loading,setLoading] = useState(false);
    let navigate = useNavigate();

    const fetchData = async()=>{
      setLoading(true);
      let tempData = await contract.methods.getPlayHouseDatas(id).call();
      console.log(tempData);
      setData(tempData);
      setLoading(false);

    }


    useEffect(()=>{
      fetchData();

    },[])

  return (
    <div style={{border:"1px solid black", margin:"2rem 0", borderRadius:"6px", width:"70%", padding:"1.5rem 3rem", cursor:"pointer"}} onClick={()=>clickCard(id)}>
   {
     !loading && !data ?
     <h2 style={{textAlign:"center",padding:"2rem 0"}}>Loading...</h2>
     :
     <>
   
   
    {
      data && data.isActive?
      <div style={{color:"green",textAlign:"center"}}>
      ACTIVE
  </div>:
  <div style={{color:"red",textAlign:"center"}}>
  CLOSED
</div>
    }
   
      <div >
          <b>{  data && data._name}</b> 
     </div><br/>
     
     <div>
        <i>{  data && data._description}</i> 
     </div>
     Owner : <b>{  data && data._creator}</b>
     <div>
     Betting Price : <b>{data &&web3.utils.fromWei(  data && data.bettingPrice.toString(),"ether")} eth</b> 
     </div>
     {
         data && !data.isActive &&
       <div>
       Winner : <b>{  data && data._winner}</b>
       </div>

     }

     <div style={{textAlign:"center"}}>
          Enter the game

     </div>
    
 
     </>
   }
 
    </div>
  )
}

export default DisplayCards