import React, { useState, useEffect } from "react";
// Components
import { WrapCentered, CustomFabSpinner } from "./index";
// Services
import { slideStates } from "services/config";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStepForward,
  faQuestion,
  faPaperPlane
} from "@fortawesome/free-solid-svg-icons";

const MatchingSend = props => {
  return (
    <div style={{ marginTop: 12, textAlign: "center" }}>
      <CustomFabSpinner
        isLoading={props.slide.states.includes(slideStates.GRADING_INPUT)}
        isDisabled={props.isDisabled}
        icon={<FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: 20 }} />}
        clickHandler={props.checkAnswerHandler}
      />
    </div>
  );
};

export default MatchingSend;
