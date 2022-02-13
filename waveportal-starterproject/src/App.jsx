import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [loading, setLoading] = useState("");

  const contractAddress = "0x0D781FF063a3D62382cf87565b658Ba58C45D87C";
  const contractABI = abi.abi;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signers = provider.getSigner();
  const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signers);

  

  const checkIfWalletConnected = async() => {
    try{
      const {ethereum} = window;

      if(!ethereum){
        console.log("Make sure Metamask is installed");
      }
      else
      {
        console.log("Ethereum object found bitch", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length != 0)
      {
        const account = accounts[0];
        console.log("Authorized account: ", account);
        setCurrentAccount(account);

        if(totalWaves > 0)
        {
          getAllWaves();
        }
      }
      else
      {
        console.log("No authorized account found");
      }
    }
    catch(error){
      console.log("Error");
    }
  }

  const getTotalWaves = async() => {
      try
      {
        let count = await wavePortalContract.getTotalWaves();
        setTotalWaves(count.toNumber());
      }
      catch(error)
      {
        console.log(error);
      }
  }
  
  const getAllWaves = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const waves = await wavePortalContract.getAllWaves();

      const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);
    

  const connectWallet = async () => {
    try{
      const {ethereum} = window;

      if(!ethereum){
        alert("Metamask no comprede?");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    }
    catch (error){
      console.log(error);
    }
  }

  const wave = async () => {
    try {
      const {ethereum} = window;

      if(ethereum){
        let waveCount = await wavePortalContract.getTotalWaves ();
        console.log("Total wave count: ", waveCount.toNumber());

        const waveTxn = await wavePortalContract.wave("Hello!", {gasLimit:300000});
        console.log("Mining transaction..", waveTxn.hash);
        setLoading(true);
        await waveTxn.wait();
        console.log("Transactiong (wave) mined", waveTxn.hash);
        setLoading(false);
        waveCount = await wavePortalContract.getTotalWaves();
        console.log("Total wave count ", waveCount.toNumber())
        window.location.reload()
        
      }
      else
      {
        console.log("No metamask?");
      }
    }
    catch(error)
    {
      console.log(error);
    }
  }

  useEffect (() => {
    checkIfWalletConnected();
    }, [])  
  
  useEffect (() =>{
    getTotalWaves();}, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Matt, I work in software. Anyone who waves at me will have their wave recorded on the Rinkeby Blockchain, and have a chance to win .0001 eth (Rinkeby ver) 😊. After waving, there is a 15 minute cooldown, so no spamming!
        </div>

        


        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}> Connect Wallet </button>
          
        )}

        {currentAccount && <div className = "bio">Total number of waves: {totalWaves} </div>}

        {loading && (<div className = "bio">Mining wave... Please Wait 😊</div>)}


        {
          allWaves.map((wave, index) => {
          return(
            <div key={index} style ={{ backgroundColor:"OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}  
      </div>
    </div>
  );
}

export default App