import React, { useEffect, useState } from 'react'
import { CryptoState } from '../Context';
import { HistoricalChart } from '../config/api';
import axios from 'axios';
import { styled } from '@mui/system';
import { CircularProgress } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from 'react-chartjs-2'; 
import SelectButton from './SelectButton';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Container = styled('div')(({theme}) =>({
    width: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
    },
}))


const chartDays = [
  { label: "24 Hours", value: 1,},
  { label: "30 Days", value: 30,},
  { label: "3 Months", value: 90,},
  { label: "1 Year", value: 365,},
];

const CoinInfo = ({coin}) => {
    const [historicalData, setHistoricalData] = useState();
    const [days, setDays] = useState(1);
    const [flag, setflag] = useState(false);

    const {currency} = CryptoState();

    const fetchHistoricalData = async() =>{
        const {data} = await axios.get(HistoricalChart(coin.id, days, currency));
        
        setHistoricalData(data.prices);
    }

    useEffect(() =>{
        fetchHistoricalData();
    },[currency,days]);

  return (
    <Container>
        {!historicalData ? (<CircularProgress sx={{color:"#1E90FF",}} size={250} thickness={1}/>)
        :(
        <>
            <Line
                data={{labels: historicalData.map((coin) => {
                    let date = new Date(coin[0]);
                    let time = date.getHours() > 12
                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                        : `${date.getHours()}:${date.getMinutes()} AM`;
                    return days === 1 ? time : date.toLocaleDateString();
                    }),
                    datasets: [{
                        data: historicalData.map((coin) => coin[1]),
                        label: `Price ( Past ${days} Days ) in ${currency}`,
                        borderColor: "#1E90FF",
                    }],
                }}
                options={{
                    elements: {
                        point: {
                            radius: 1,
                        },
                    },
                }}
            />

            <div style={{display: "flex",marginTop: 20,justifyContent: "space-around",width: "100%",}}>
              {chartDays.map((day) => (
                <SelectButton key={day.value} onClick={() => {setDays(day.value); setflag(false);}}
                  selected={day.value === days}>
                    {day.label}
                </SelectButton>
              ))}
            </div>
        </>)}
    </Container>
  )
}

export default CoinInfo