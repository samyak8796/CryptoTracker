import axios from 'axios';
import React, { Children, createContext, useContext, useEffect, useState } from 'react'
import { CoinList } from './config/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const crypto = createContext();

const Context = ({children}) => {

    const [currency, setCurrency] = useState("INR");
    const [symbol, setSymbol] = useState("₹");
    const [coins,setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState({
        open:false, message:"", type:"success",
    });
    const [watchlist, setWatchlist] = useState([]);

    useEffect(()=>{
        if(user){
            const coinRef = doc(db,"watchlist",user.uid);

            const unsubscribe = onSnapshot(coinRef,coin=>{
                if(coin.exists()){
                    console.log(coin.data().coins);
                    setWatchlist(coin.data().coins);
                }
                else{
                    console.log("No Items in the watchlist")
                }
            });
            return () =>{
                unsubscribe();
            }
        }

        
    },[user])

    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
            if(user) setUser(user);
            else setUser(null);

            // console.log(user)
        })
    },[]);

    const fetchCoins = async() =>{
        setLoading(true);
        const {data} = await axios.get(CoinList(currency))
        setCoins(data);   
        setLoading(false);
    }

    useEffect(()=>{
        if(currency=="INR") setSymbol("₹");
        else if(currency=="USD") setSymbol("$");
        else if(currency=="EURO") setSymbol("€");
    }, [currency]);


   return (
    <crypto.Provider value={{currency,symbol,setCurrency,coins,loading,fetchCoins,alert,setAlert,user,watchlist}}>
        {children}
    </crypto.Provider>
  )
}

export default Context;

export const CryptoState = () =>{
    return useContext(crypto);
}