import { dividerClasses } from "@mui/material";
import React, { useState } from "react";
import "./Home.css";
import VIN_Form from "./VIN_Form";
import Box from "@mui/material/Box";
import LicensePlateForm from "./LicensePlateForm";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import RadioGroup, { useRadioGroup } from "@mui/material/RadioGroup";
import FormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

function VehicleValueForm() {
  const [selectedValue, setSelectedValue] = useState('VIN');
  const [getValueOption, setGetValueOption] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    if (selectedValue ==='Plate') {
      setGetValueOption(true)
    }
    else{
      setGetValueOption(false)
    }

  };
  return (
    <div className="box">
      <Box sx={{ flexGrow: 1 }} width={400}>
        <Grid container>
          <Grid xs={12} m={3}>
            <h1 className="logo">CARZILA</h1>
          </Grid>
          <Grid xs={12}>
            <h1 className="welcometext">Welcome to Carzila</h1>
            <p className="welcometext">Get your Trade-in Value now</p>
            </Grid>
            <Grid xs={12} ml={6}>
      <Radio
        checked={selectedValue === 'VIN'}
        onChange={handleChange}
        value="VIN"
        name="radio-buttons"
        inputProps={{ 'aria-label': 'VIN' }}
      />VIN
      <Radio
        checked={selectedValue === 'Plate'}
        onChange={handleChange}
        value="Plate"
        name="radio-buttons"
        inputProps={{ 'aria-label': 'Plate' }}
      />Plate
          </Grid>
          {getValueOption ? <VIN_Form/> : <LicensePlateForm/>}
      

          <Grid item xs={5}></Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              endIcon={<DriveEtaIcon />}
              className="getValueButton"
              style={{ float: "right" }}
            >
              Get your Value
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default VehicleValueForm;
