import React,{useState} from 'react'
import useEth from "../contexts/EthContext/useEth";
import { useNavigate } from 'react-router-dom';

function CreateGame() {
   
    const [loading,setLoading] = useState(false);
    const { state } = useEth();
    let navigate = useNavigate();


    const [data,setData] = useState({
        name:'',
        description:'',
        bettingPrice:''
    });

    const changeData = (nameToChange,value)=>{

        //let tempData = data[nameToChange];
        let error =0; 
        if(nameToChange=="bettingPrice"){
            if(value<0){
                error=1;
            }
        }

        if(error==0){
            setData({
                ...data,
                [nameToChange]:value
            })
        }
       

    }

    const submitForm = async(e)=>{
        e.preventDefault();
        if(data.bettingPrice>0){

           let _bettingPrice = state.web3.utils.toWei(data.bettingPrice,"ether");
           let _entryFee = (state.web3.utils.toWei('0.01',"ether"));

            let _total = (parseInt(_bettingPrice)+parseInt(_entryFee))+10000;
            //console.log(_total-2000000000000010);
            setLoading(true);
            let result = await state.contract.methods.createPlayHouse(data.name,data.description,_bettingPrice).send({
                from:state.accounts[0],
                value:_total
            });
            let totalHouses = await state.contract.methods.totalPlayHouses().call();
            setLoading(false);
            navigate(`/game/${totalHouses-1}`)
        }
    }


  return (
    <div>

        <div>
            You will have to pay entry fee, the betting price you determine for playing along with the gas price while creating a gamespace. 
            <br/><br/>
            You will be automatically redirected to the game page. Be patient!
            <br/>
            After creation of gameSpace, creator wont be allowed to leave the game, if left, the second player will be awarded.  
        </div><br/>
        <form onSubmit={(e)=>submitForm(e)}>
             <input 
                 type="text"
                 placeholder="Name of the game" 
                 value={data.name} 
                 required
                 onChange={(e)=>changeData('name',e.target.value)}
                style={{margin:"1rem 0",display:"block",padding:"0.5rem 1rem", width:"500px"}}
               
               />
               <input 
                 type="text"
                 placeholder="Description of the game" 
                 value={data.description} 
                 required
                 onChange={(e)=>changeData('description',e.target.value)}
                     style={{margin:"1rem 0",display:"block",padding:"0.5rem 1rem", width:"500px"}}
               />
               <input 
                 type="number"
                 placeholder="Betting price in ether" 
                 value={data.bettingPrice} 
                 decimal-places="2"
                 onChange={(e)=>changeData('bettingPrice',e.target.value)}
                     style={{margin:"1rem 0",display:"block",padding:"0.5rem 1rem", width:"500px"}}
                    required
               />
               <input disabled={loading} type="submit" value="Create new game space">

               </input>


        </form>
       


    </div>
  )
}

export default CreateGame