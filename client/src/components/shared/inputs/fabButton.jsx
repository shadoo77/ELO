import React from "react";

// Material UI
import { Fab, CircularProgress, Tooltip } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => {
  return {
    fabWrapper: {
      // background: "rgba(250,250,250,1)",
      position: "relative",
      borderRadius: "50%"
    },
    fabProgress: {
      color: "rgba(255,255,255,0.8)",
      position: "absolute",
      zIndex: 1,
      top: 0,
      left: 0
      // top: ({ variant }) =>
      //   variant === "extended" ? -12 : 0,
      // left: ({ variant }) =>
      //   variant === "extended" ? -12 : 0,
      // marginTop: ({ variant, marginTop }) =>
      //   variant === "extended" && `${marginTop}%`,
      // marginLeft: ({ variant, marginLeft }) =>
      //   variant === "extended" && `${marginLeft}%`,
    },
    fab: {
      [theme.breakpoints.down("xl")]: {
        width: "60px",
        height: "60px"
      },

      [theme.breakpoints.down("md")]: {
        width: "60px",
        height: "60px"
      }
    }
  };
});

const FabButton = (props) => {
  const { variant, marginTop, marginLeft, tooltipText } = props;

  const classes = useStyles({
    variant,
    marginTop,
    marginLeft
  });

  const IconComponent = () => props.icon;

  const renderButton = () => (
    <Fab
      type={props.type ? props.type : "button"}
      variant={variant}
      color="primary"
      className={classes.fab}
      disabled={props.disabled ? props.disabled : false}
      onClick={props.clickHandler}
    >
      <IconComponent className={classes.fabIcon} />
    </Fab>
  );

  return (
    <div className={classes.fabWrapper}>
      {tooltipText ? (
        <Tooltip title={tooltipText}>
          <div>{renderButton()}</div>
        </Tooltip>
      ) : (
        renderButton()
      )}

      {props.loading && (
        <CircularProgress size={60} className={classes.fabProgress} />
      )}
    </div>
  );
};

export default FabButton;
