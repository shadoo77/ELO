import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
// Components
import { CustomFabSpinner } from "./index";
// Services
import { slideStates } from "services/config";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const CustomSend = props => {
  return (
    <div style={{ marginTop: 12, textAlign: "center" }}>
      <CustomFabSpinner
        isLoading={props.slideStates.includes(slideStates.GRADING_INPUT)}
        isDisabled={
          props.slideStates.includes(slideStates.DISPLAYING_FEEDBACK) ||
          props.isDisabled
        }
        icon={<FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: 20 }} />}
        clickHandler={props.checkAnswerHandler}
      />
    </div>
  );
};

CustomSend.propTypes = {};

export default withRouter(CustomSend);
