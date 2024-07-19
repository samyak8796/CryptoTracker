import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { CryptoState } from '../../Context';
import { Avatar } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { numberWithCommas } from '../Currencytable';
import {AiFillDelete} from "react-icons/ai"
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function UserSideBar() {

    const {user, setAlert, watchlist, coins, symbol} = CryptoState();
    const navigate = useNavigate();

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


  const logOut = () =>{
        signOut(auth);
        setAlert({open:true,type:"success",message:"LogOut Successful"});
        toggleDrawer();
  }
  

  const removeFromWatchlist = async(coin) => {
      // const watchlistRef = collection(db, "watchlist");
      const coinRef = doc(db, "watchlist",user.uid);
      try{
        await setDoc(coinRef,{coins:watchlist.filter((watch)=> watch !== coin?.id)},{merge:true});
        setAlert({open:true,message:`${coin.name} Removed from the WatchList`,type:"success"});
      }
      catch(error){
        setAlert({open:true,message: error.message,type:"error"});
      }
  }


  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar onClick={toggleDrawer(anchor,true)} sx={{height:38,width:38,cursor:"pointer", backgroundColor:"#1E90FF"}} 
                src={user.photoURL} alt={user.displayName || user.email}/>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <Box sx={{width:350,padding:5,height:"100%",display:"flex",flexDirection:"column",fontFamily:"Lato", backgroundColor:"#14161a"}}>
                <Box sx={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"25px",height:"92%"}}>
                    <Avatar src={user.photoURL} alt={user.displayName || user.email} style={{width:100,height:100,cursor:"pointer",backgroundColor:"#1E90FF",objectFit:"contain"}}/>
                    <span style={{width:"100%",fontSize:20,textAlign:"center",fontWeight:"bolder",wordWrap:"break-word",color:"white"}}>
                        {user.displayName || user.email}
                    </span>

                    <Box sx={{flex:1,width:"100%",backgroundColor:"grey",borderRadius:1,padding:10,paddingTop:1,marginBottom:2,display:"flex",flexDirection:"column",alignItems:"center",gap:2,overflowY:"scroll"}}>
                        <span style={{fontSize:15,color:"white",fontFamily:"Lato"}}>
                            WatchList
                        </span>

                        {coins.map((coin) => {
                            if (watchlist.includes(coin.id))
                              return (
                                <Box sx={{padding: 1,borderRadius:2,color:"black",width:"260%",display:"flex",
                                          alignItems:"center", backgroundColor:"#1e90ff",justifyContent: "space-between",
                                          boxShadow: "0 0 2px black",fontSize:13}}>
                                  <span onClick={() => {navigate(`/coins/${coin.id}`);}} style={{ cursor: "pointer" }}>
                                    {coin.name}
                                  </span>
                                  <span style={{ display: "flex", gap: 8 }}>
                                    {symbol}{" "}
                                    {numberWithCommas(coin.current_price.toFixed(2))}
                                    <AiFillDelete style={{ cursor: "pointer" }} fontSize="16"
                                      onClick={() => removeFromWatchlist(coin)}/>
                                  </span> 
                                </Box>
                              );
                            else return <></>;
                          })}
                    </Box>
                </Box>

                <Button variant="contained" sx={{height:"8%",width:"100%",backgroundColor:"#1e90ff",fontFamily:"Lato"}} onClick={logOut}>
                    Log Out
                </Button>
            </Box>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}