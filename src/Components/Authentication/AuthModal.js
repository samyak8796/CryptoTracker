  import * as React from 'react';
  import Backdrop from '@mui/material/Backdrop';
  import Box from '@mui/material/Box';
  import Modal from '@mui/material/Modal';
  import Fade from '@mui/material/Fade';
  import Button from '@mui/material/Button';
  import { Tab, Tabs } from '@mui/material';
  import Login from './Login';
  import SignUp from './SignUp';
  import GoogleButton from 'react-google-button';
  import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  import { auth } from '../../firebase';
  import { CryptoState } from '../../Context';

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#14161a',

    // border: '2px solid #1E90FF',
    borderRadius: '10px',
    boxShadow: 24,
    // p: 3,
  };

  export default function AuthModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {setAlert} = CryptoState();

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const googleProvider = new GoogleAuthProvider();

    const signInWithGoogle = () =>{
      signInWithPopup(auth, googleProvider).then((result) => {
        setAlert({
          open: true,
          message: `Sign Up Successful. Welcome ${result.user.email}`,
          type: "success",
        });

        handleClose();
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
      }).catch((error) => {

        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
        return;
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
    }

    return (
      <div>
        <Button variant="contained" sx={{width: 85,height: 40,backgroundColor: "#1E90FF",}}
          onClick={handleOpen}>
            Login
        </Button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Box sx={{ backgroundColor:"transparent", color:"white"}}>
                <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="basic tabs example">
                  <Tab label="Login" sx={{color:"white"}}/>
                  <Tab label="Sign Up" sx={{color:"white"}}/>
                </Tabs>
              </Box>

              {value===0 && <Login handleClose={handleClose}/>}
              {value===1 && <SignUp handleClose={handleClose}/>}

              <Box sx={{padding:3,paddingTop:0,display:"flex",flexDirection:"column",textAlign:"center",gap:2,fontSize:18}}>
                <span style={{color:"white"}}>OR</span>
                <GoogleButton style={{ width: "100%", outline: "none" }} onClick={signInWithGoogle}/>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </div>
    );
  }