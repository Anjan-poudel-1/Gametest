import React from 'react'
import Web3 from "web3";
import {useNavigate} from 'react-router-dom'
function Header({account}) {
    const navigate = useNavigate();
  return (
    <div style={{marginBottom:"2rem",backgroundColor:"#181A21",color:"white",padding:" 1rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{cursor:"pointer",fontSize:"20px"}} onClick={()=>navigate('/')}>
            GameHouse
        </div>
        {
            account?
            <>
                {account[0]}
            </>:
            <button>
                Connect wallet
            </button>
        }
    </div>
  )
}

export default Header