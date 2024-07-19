import { AppBar, CssBaseline, MenuItem, Select, ThemeProvider, Toolbar, Typography } from '@mui/material'
import { Container, createTheme } from '@mui/system'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CryptoState } from '../Context'
import AuthModal from './Authentication/AuthModal'
import UserSideBar from './Authentication/UserSideBar'

const style = {
  // Root class for the input field
  '& .MuiOutlinedInput-root': {
    color: 'white',
    fontFamily: 'Lato',
    fontWeight: 'bold',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ffffff',
  },
  '& .MuiSelect-icon': { // Target the dropdown icon element
    fill: 'white', // Set fill color to white
  },
  color: '#ffffff', // Consistent white color across elements
  width: '100px',
  height: '40px',
  marginRight: '15px',
};

const Header = () => {
  const navigate = useNavigate();

  const {currency, setCurrency, user} = CryptoState();

  return (
      <AppBar position='static' color='transparent'>
        <Container>
          <Toolbar>
              <Typography variant='h6' onClick={()=>navigate("/")} sx={{flex:1, color:'	#1E90FF', fontFamily:'lato', fontWeight:'bold', cursor:'pointer'}}>
                CryptoTracker
              </Typography>
              <Select variant='outlined' sx={style}
                  value={currency} onChange={(e)=> setCurrency(e.target.value)}
                >
                <MenuItem value={"INR"}>INR</MenuItem>
                <MenuItem value={"USD"}>USD</MenuItem>
                {/* <MenuItem value={"EURO"}>EURO</MenuItem> */}
              </Select>

              {user ? <UserSideBar/> : <AuthModal/>}
          </Toolbar>
        </Container>
      </AppBar> 
  );
}

export default Header
