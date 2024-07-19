import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { CryptoState } from '../../Context';
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

const SignUp = ({handleClose}) => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {setAlert} = CryptoState();

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setAlert({open:true,message:"Passwords do not match",type:"error",});
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(auth,email,password);
            setAlert({open:true, message:`Sign Up Successful. Welcome ${result.user.email}`,type: "success",});

            handleClose();
        } 
        catch (error) {
            const errorCode = error.code; 
            let errorMessage = 'Sign up failed.';

            switch (errorCode) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Email already in use.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak.';
                    break;
                default:
                    errorMessage = error.message;
            }

            setAlert({open:true,message:errorMessage,type:"error",});
            return;
        }
    };

  return (
    <Box p={3} sx={{display:"flex", flexDirection:"column", gap:"20px"}}>
        <TextField variant="outlined" label="Enter Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} fullWidth sx={style}/>
        <TextField variant="outlined" label="Enter Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} fullWidth sx={style}/>
        <TextField variant="outlined" label="Confirm Password" type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} fullWidth sx={style}/>
        <Button variant='contained' size='large' sx={{bgcolor:"#1E90FF"}} onClick={handleSubmit}>Sign Up</Button>
    </Box>
  )
}

export default SignUp