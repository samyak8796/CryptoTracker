import { Typography } from '@mui/material';
import { Box, Container, createTheme, display, styled } from '@mui/system'
import React from 'react'
import Carousel from './Carousel';

const Banner = () => {
  return (
    <Box sx={{backgroundImage: `url(./bannerImg.jpg)`, backgroundSize: 'cover',backgroundRepeat: 'no-repeat',}}>
      <Container sx={{  height: 450, display: 'flex', flexDirection: 'column',paddingTop: 25,justifyContent: "space-around",}}>
        <Box sx={{display:"flex",height: "5%",flexDirection:"column",justifyContent:"center", textAlign:"center", }}>
          <Typography variant="h2" sx={{ fontWeight: "bold",fontFamily: "Lato",marginTop:-18, marginBottom:0}}>
            CryptoTracker
          </Typography>
          <Typography variant="subtitle2" sx={{color: "darkgrey", fontFamily: "Lato",}}>
            Check All The Recent Trends Of Crypto Currencies
          </Typography>
        </Box>
        <Carousel/>
      </Container>
    </Box>
  )
}

export default Banner