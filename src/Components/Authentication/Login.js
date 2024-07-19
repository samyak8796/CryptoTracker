import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react'
import { CryptoState } from '../../Context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const style = {
    "& .MuiOutlinedInput-root": {
          color: "white",
          fontFamily: "Lato",
          fontWeight: "bold",
        "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1E90FF",
        },
    },
    "& .MuiInputLabel-outlined": {
        color: "#1E90FF",
    },
};

const Login = ({handleClose}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {setAlert} = CryptoState();

    const handleSubmit = async() =>{
      if(!email || !password){
        setAlert({open:true,message:"Please fill all the fields",type:"error"});
        return;
      }
      
      try{
        const result = await signInWithEmailAndPassword(auth,email,password);

        setAlert({open:true, message:`Login Successful. Welcome ${result.user.email}`,type:"success"});
        handleClose();
      }
      catch(error){
        const errorCode = error.code;
        let errorMessage = 'Login failed.'

        switch (errorCode) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email.'
            break;
          case 'auth/user-not-found':
            errorMessage = 'User not found.'
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password.'
            break;
          default:
            errorMessage = error.message;
        }

        setAlert({ open: true, message: errorMessage, type: 'error' });
      }
    }
     
  return (
     <Box p={3} sx={{display:"flex", flexDirection:"column", gap:"20px"}}>
        <TextField variant="outlined" label="Enter Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} fullWidth sx={style}/>
        <TextField variant="outlined" label="Enter Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} fullWidth sx={style}/>
        <Button variant='contained' size='large' sx={{bgcolor:"#1E90FF"}} onClick={handleSubmit}>Login</Button>
    </Box>
  ) 
}

export default Login