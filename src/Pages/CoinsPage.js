import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CryptoState } from '../Context';
import { SingleCoin } from '../config/api';
import axios from 'axios';
import { styled } from '@mui/system';
import CoinInfo from '../Components/CoinInfo';
import { Button, LinearProgress, Typography } from '@mui/material';
import { numberWithCommas } from '../Components/Currencytable';
import { db } from '../firebase';
import {collection, doc,setDoc} from 'firebase/firestore';

const Container = styled('div')(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Sidebar = styled('div')(({ theme }) => ({
  width: "30%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 25,
  borderRight: "2px solid grey",
}));

const MarketData = styled('div')(({ theme }) => ({
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection:"column",
      alignItems:"center",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
}))


const CoinsPage = () => {
  const {id} = useParams();
  const [coin, setCoin] = useState();

  const {currency, symbol, user, setAlert, watchlist} = CryptoState();

  const fetchCoin=async()=>{
      const {data} = await axios.get(SingleCoin(id));
      setCoin(data);
  };

  const alreadyInWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async() => {
      const watchlistRef = collection(db, "watchlist");
      const coinRef = doc(watchlistRef,user.uid);
      try{
        await setDoc(coinRef,{coins:watchlist?[...watchlist,coin?.id]:[coin?.id]},{merge:true});
        setAlert({open:true,message:`${coin.name} Added to the WatchList`,type:"success"});
      }
      catch(error){
        setAlert({open:true,message: error.message,type:"error"});
      }
  } 

  const removeFromWatchlist = async() => {
      const watchlistRef = collection(db, "watchlist");
      const coinRef = doc(watchlistRef,user.uid);
      try{
        await setDoc(coinRef,{coins:watchlist.filter((watch)=> watch !== coin?.id)},{merge:true});
        setAlert({open:true,message:`${coin.name} Removed from the WatchList`,type:"success"});
      }
      catch(error){
        setAlert({open:true,message: error.message,type:"error"});
      }
  }

  useEffect(()=>{
    fetchCoin();
  },[]);

  if(!coin) return <LinearProgress sx={{backgroundColor: "#1E90FF"}}/>

  return (
    <Container>
      <Sidebar>
        <img src={coin?.image.large} alt={coin?.name} height="200" style={{ marginBottom: 20 }}/>
        <Typography variant="h3" sx={{fontWeight: "bold",marginBottom: 5,fontFamily: "Lato",}}> {coin?.name} </Typography>
        <Typography variant="subtitle1" sx={{ width:"100%",fontFamily: "Lato",padding: 5,paddingBottom: 10,paddingTop: 0,textAlign: "justify",}}>
          {(coin?.description.en.split(". ")[0])}
        </Typography>
        <MarketData>
           <span style={{ display: "flex" }}>
            <Typography variant="h5" sx={{fontWeight: "bold",marginBottom: 5,fontFamily: "Lato",}}> Rank: </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" sx={{fontFamily: "Lato",}}>
              {numberWithCommas(coin?.market_cap_rank)}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" sx={{fontWeight: "bold",marginBottom: 5,fontFamily: "Lato"}}> Current Price:</Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" sx={{fontFamily: "Lato",}}>
              {symbol}{" "}
              {numberWithCommas(coin?.market_data.current_price[currency.toLowerCase()])}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" sx={{fontWeight: "bold",marginBottom: 5,fontFamily: "Lato"}}>Market Cap:</Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" sx={{fontFamily: "Lato",}}>
              {symbol}{" "}
              {numberWithCommas(coin?.market_data.market_cap[currency.toLowerCase()].toString().slice(0, -6))}
              M
            </Typography>
          </span>

          {user && (
            <Button variant="outlined" sx={{width:"100%",height:40,backgroundColor: "#1e90ff", color:"white", fontFamily:"Lato",borderRadius: 4,
              "&:hover": alreadyInWatchlist? {backgroundColor: "red",color: "black",} :{backgroundColor: "green",color: "black",}}} 
              onClick={alreadyInWatchlist? removeFromWatchlist : addToWatchlist}>
                  {alreadyInWatchlist? "Remove from watchlist" : "Add to WatchList"}
            </Button>
          )}
        </MarketData>
      </Sidebar>

      <CoinInfo coin={coin}/>
    </Container>
  )
}

export default CoinsPage