import React,{useEffect, useState} from 'react'

function GameInfo({fee,totalGames,activeGames,completedGames}) {
    

  return (
    <div style={{margin:"2rem 0"}}>
        <h3>
        GameInfo
        </h3>
         <br/>
        Total game houses - {totalGames}<br/>
        Active game houses - {activeGames}<br/>
        Completed games - {completedGames}<br/>
        Entry price for a game- {fee && `${fee} eth`} <br/>

        <i>Game house desc...</i>

    </div>
  )
}

export default GameInfo