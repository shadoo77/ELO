import React from "react";
import {
  TextField,
  IconButton,
  Grid,
  Icon,
  InputAdornment,
  InputBase,
  Paper,
  Divider
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  container: {
    margin: "10px 0",
    padding: 0,
    width: "100%"
  },
  extend: {
    //margin: theme.spacing(1),    " transition: width 0.75s cubic-bezier(0.000, 0.795, 0.000, 1.000)"
    webkitTransition: "width 1s",
    transition: "width 0.75s",
    width: "100%"
  },

  searchBoxPaper: {
    margin: theme.spacing(1, 0, 0, 0),
    padding: 0,
    width: "100%",
    display: "flex"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 0
  }

  // shrink: {
  //   webkitTransition: "width 1s",
  //   transition: "width 0.75s",
  //   width: 0
  // }
}));

export default function({ value, handleChange, clearSearch }) {
  //const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();

  // const toggleSearchBox = () => {
  //   setIsOpen(true);
  // };

  // const closeSearchBox = () => {
  //   setIsOpen(false);
  // };

  return (
    // style={{ maxWidth: 350, margin: 10 }}
    <div className={classes.container}>
      <Grid
        container
        item
        xs={12}
        spacing={1}
        justify="center"
        alignItems="flex-end"
        // onClick={() => toggleSearchBox()}
        // onBlur={() => closeSearchBox()}
      >
        {/* <Grid
          item
        >
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid xs item>
          <TextField
            name="search"
            className={extend} // className={isOpen ? extend : shrink}
            id="input-with-icon-grid"
            placeholder="With a grid"
            value={value}
            onChange={e => handleChange(e.target.value)}
            fullWidth
          />
        </Grid> */}

        <TextField
          //variant="filled"
          className={classes.extend}
          value={value}
          onChange={e => handleChange(e.target.value)}
          id="input-with-icon-textfield"
          placeholder="Zoeken .."
          fullWidth
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "#aaa" }} />
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton onClick={() => clearSearch()}>
                  <Icon>close</Icon>
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* <div className={classes.searchBoxPaper}>
          <IconButton className={classes.iconButton} aria-label="menu">
            <SearchIcon />
          </IconButton>
          <InputBase
            className={classes.input}
            value={value}
            onChange={e => handleChange(e.target.value)}
            placeholder="Zoeken .."
            inputProps={{ "aria-label": "search google maps" }}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
          <IconButton
            className={classes.iconButton}
            aria-label="directions"
            onClick={() => clearSearch()}
          >
            {value !== "" && <Icon>close</Icon>}
          </IconButton>
        </div> */}
      </Grid>
    </div>
  );
}
