import React from "react";
// Services
import { slideTypes } from "services/config";
// Components
import { CustomButton } from "../buttons";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
// Icons
import { faMusic, faHeadphonesAlt } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) =>
  createStyles({
    center: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
  })
);

const CoverInstruction = (props) => {
  const classes = useStyles();

  const pickIcon = (slide) => {
    switch (slide.__t) {
      case slideTypes.TAALBEAT:
        return faMusic;
      default:
        return faHeadphonesAlt;
    }
  };

  return (
    <div className={classes.center}>
      <CustomButton
        className={classes.flexButton}
        icon={pickIcon(props.slide)}
        iconSize="24"
        color="primary"
        clickHandler={() => {}}
        isDisabled={true}
        fabSize="large"
      />
    </div>
  );
};

export default CoverInstruction;
