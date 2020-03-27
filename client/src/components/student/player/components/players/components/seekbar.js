// Material UI
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

export default withStyles({
  root: {
    color: "rgb(250,250,250)",
    height: 8,
    "&:active $track": {
      transition: "width 0s linear"
    },
    "&:active $thumb": {
      transition: "left 0s linear"
    }
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: "#0277bd",
    border: "2px solid currentColor",
    marginTop: -6,
    marginLeft: -10,
    transition: "left .2s linear",
    "&:focus,&:hover,&:active": {
      backgroundColor: "#01579b",
      boxShadow: "inherit"
    },
    "&:active": {
      transition: "left 0s linear"
    }
  },
  track: {
    height: 8,
    borderRadius: 4,
    transition: "width .2s linear",
    "&:active": {
      transition: "width 0s linear"
    },
    "&:active $thumb": {
      transition: "left 0s linear"
    }
  },
  rail: {
    height: 8,
    borderRadius: 4
  }
})(Slider);
