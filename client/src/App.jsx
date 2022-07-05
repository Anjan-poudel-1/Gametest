

import DisplayCards from "./components/DisplayCards";
import GameInfo from "./components/GameInfo";
import Header from "./components/Header";
import useEth from "./contexts/EthContext/useEth";
import Homepage from "./Pages/Homepage";
import { BrowserRouter as Router ,Routes,Route } from "react-router-dom";
import CreateGame from "./Pages/CreateGame";
import IndividualGame from "./Pages/IndividualGame";
function App() {
  const { state } = useEth();
  

    console.log(state);

  return (
   
      <div id="App" style={{padding:"3rem",fontSize:"16px"}}>
        {
          !state.contract?
          "Get a wallet... connect to kovan network":
        
          <>
            <Header account = {state.accounts}/>
            
                <Routes>
                    <Route exact path="/" element={<Homepage contract= {state.contract} web3={state.web3} />} />
                    <Route path="/create-new" element={<CreateGame contract= {state.contract} web3={state.web3}/>} />
                    <Route path="/game/:id" element={<IndividualGame />} />
                </Routes>
            
         
          
          </>
        }
      
      </div>
    
  );
}

export default App;
