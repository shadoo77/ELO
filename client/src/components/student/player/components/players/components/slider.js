// Material UI
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

export default withStyles({
  root: {
    color: "rgb(250,250,250)",
    height: 8
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: "#0277bd",
    border: "2px solid currentColor",
    marginTop: -6,
    marginLeft: -10,

    "&:focus,&:hover,&:active": {
      backgroundColor: "#01579b",
      boxShadow: "inherit"
    }
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  }
})(Slider);
