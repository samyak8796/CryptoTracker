import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CoinList } from '../config/api';
import { CryptoState } from '../Context';
import { borderRadius, Box, Container, createTheme, margin, textAlign, ThemeProvider } from '@mui/system';
import { CssBaseline, LinearProgress, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const style = {
    // Root class for the input field
    "& .MuiOutlinedInput-root": {
          color: "white",
          fontFamily: "Lato",
          fontWeight: "bold",
        // Class for the border around the input field
        "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1E90FF",
        },
    },
    // Class for the label of the input field
    "& .MuiInputLabel-outlined": {
        color: "#ffffff",
    },
    marginBottom: 5 , width: "100%"
};

const Currencytable = () => {

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const {currency, symbol, coins, loading, fetchCoins} = CryptoState();

    

    // console.log(coins);
    useEffect(()=>{
        fetchCoins();
    },[currency]);

    const handleSearch = () => {
        return coins.filter((coin) =>
            coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search)
    )};

    // const darkTheme = createTheme({
    //     palette: {
    //         mode: 'dark',
    //     },
    //     typography: {
    //         margin:18,
    //         variant:"h4",
    //         fontFamily: 'Lato', 
    //     },
    // });

  return (
    // <ThemeProvider theme={darkTheme}>
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="h4" style={{ margin: 18, fontFamily: "Lato" }}>
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField sx={style} label="Search For a Crypto Currency.." variant="outlined" 
            onChange={(e)=>setSearch(e.target.value)}/> 
        <TableContainer margintop="1">
            {loading ? (
            <LinearProgress style={{ backgroundColor: "#1E90FF" }} />
            ) :(
                <Table>
                     <TableHead style={{ backgroundColor: "#1E90FF" }}></TableHead>
                     <TableRow>
                        {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                            <TableCell
                                style={{backgroundColor:"#00BFFF", color: "white",fontWeight: "700",fontFamily: "Lato",}}
                                key={head} align={head === "Coin" ? "" : "right"}>
                                {head}
                            </TableCell>
                        ))}
                     </TableRow>
                     <TableBody>{handleSearch().slice((page-1)*10,(page-1)*10+10).map((row)=>{
                        const profit = row.price_change_percentage_24h > 0;
                        return(
                            <TableRow onClick={()=> navigate(`/coins/${row.id}`)}
                                sx={{backgroundColor: "#16171a", cursor: "pointer","&:hover": { backgroundColor: "#131111",},fontFamily: "Lato",}}
                                key={row.name}>
                                <TableCell component="th" scope="row" style={{display: "flex", gap: 15}}>
                                    <img src={row?.image} alt={row.name} height="50" style={{ marginBottom: 10 }}/>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <span style={{color:"white", textTransform: "uppercase", fontSize: 22}}> {row.symbol}
                                        </span>
                                        <span style={{ color: "white" }}> {row.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell align="right" sx={{color:"white"}}>
                                    {symbol}{" "}
                                    {numberWithCommas(row.current_price.toFixed(2))}
                                </TableCell>
                                <TableCell align="right"
                                    style={{color: profit > 0 ? "rgb(14, 203, 129)" : "red",fontWeight: 500,}}>
                                    {profit && "+"}
                                    {row.price_change_percentage_24h.toFixed(2)}%
                                </TableCell>
                                <TableCell align="right" sx={{color:"white"}}>
                                    {symbol}{" "}
                                    {numberWithCommas(row.market_cap.toString().slice(0, -6))}
                                    M
                                </TableCell>
                            </TableRow>
                        )
                     })}
                     </TableBody>
                </Table>
            )}
        </TableContainer>
        <Box sx={{borderRadius:3, marginLeft:44,marginTop:1, width:"40%",}} >
        <Pagination count={(handleSearch()?.length / 10).toFixed(0)} color="primary"
          sx={{ padding:2, width: "100%", display: "flex", justifyContent: "center", "& .MuiPaginationItem-root":{color:"white"}}}
          onChange={(_, value) => { setPage(value); window.scroll(0, 450);}}/>
        </Box>
      </Container>
    // </ThemeProvider>
    
  )
}

export default Currencytable