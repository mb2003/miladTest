import React from "react";
import TextField from "@mui/material/TextField";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "./VIN_Form.css";
import Grid from "@mui/material/Grid";



function VIN_Form() {
  return (
      <Box sx={{ height: 'auto' }} m={5}>
          <Grid container rowSpacing={2} spacing={2} wrap="wrap">
            <Grid item xs={12}>
              <h2>Please Enter your Licensplate:</h2>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic"
                label='enter your Licenseplate'
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic"
                label='your state'
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
          </Grid>
      </Box>
  );
}

export default VIN_Form;
