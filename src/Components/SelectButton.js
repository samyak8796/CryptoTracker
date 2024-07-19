import { Button } from '@mui/material';
import React from 'react'

const SelectButton = ({selected,children,onClick}) => {
    const buttonStyle = {
        border: "1px solid #1E90FF",
        borderRadius: 5,
        padding: 2,
        paddingLeft: 1,
        paddingRight: 1,
        fontFamily: "Lato",
        cursor: "pointer",
        backgroundColor: selected ? "#1E90FF" : "",
        color: selected ? "black" : "",
        fontWeight: selected ? 700 : 500,
        "&:hover": {
            backgroundColor: "#1E90FF",
            color: "black",
        },
        width: "22%",
    };
  return (
    <Button sx={buttonStyle} onClick={onClick} >
      {children}
    </Button>
  )
}

export default SelectButton