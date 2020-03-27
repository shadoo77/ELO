import React, { useState } from "react";
import { httpService } from "../../services/http";
import { apiUrl } from "../../services/config";
//import { historyService } from "../../services/history";
import { makeStyles } from "@material-ui/core/styles";

import { TextField, Button, Grid, Fab } from "@material-ui/core/";

const useStyles = makeStyles({});

const initialState = {
  selectedFile: ""
};

export default function AddCSV(props) {
  const classes = useStyles();
  const [state, setstate] = useState(initialState);

  function handleChange(e) {
    switch (e.target.name) {
      case "selectedFile":
        setstate({ selectedFile: e.target.files[0] });
        break;
      default:
        setstate({ [e.target.name]: e.target.value });
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    // this.setState({
    //   formReport: true,
    //   isLoaded: false,
    //   showErrors: false,
    //   limitErr: 5
    // });
    const { selectedFile } = state;
    let formData = new FormData();

    //formData.append('description', description);
    formData.append("selectedFile", selectedFile);
    try {
      const result = await httpService.post(
        `${apiUrl}/author/db-fill`,
        formData
      );
      console.log("results : ", result);
    } catch (err) {
      console.log("HIER BEN IK !!!");
      console.log(err.response);
    }
  }

  return (
    <Grid
      container
      spacing={4}
      justify="center"
      alignItems="center"
      className={classes.registerGrid}
    >
      <Grid item sm={2} />
      <Grid item container justify="center" alignItems="center" sm={8}>
        <h2>Add CSV file</h2>
        <form noValidate onSubmit={e => onSubmit(e)}>
          <div>
            <TextField
              variant="standard"
              id="selected-file"
              type="file"
              name="selectedFile"
              onChange={e => handleChange(e)}
              //accept=".csv"
              required
              margin="dense"
              fullWidth
            />
            <label htmlFor="selected-file" id="selected-file">
              <Button variant="outlined" component="span">
                Upload
              </Button>
            </label>
          </div>
          <Fab
            type="submit"
            variant="extended"
            color="primary"
            size="large"
            onSubmit={e => onSubmit(e)}
          >
            Opslaan
          </Fab>
        </form>
      </Grid>
      <Grid item sm={2} />
    </Grid>
  );
}
