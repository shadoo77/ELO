import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "@material-ui/core";

const meter = {
  color: "#fff",
  height: "30px",
  position: "relative",
  backgroundColor: "#555",
  MozBorderRadius: "25px",
  WebkitBorderRadius: "25px",
  borderRadius: "25px",
  padding: "5px",
  textAlign: "center",
  WebkitBoxShadow: "inset 0 -1px 1px rgba(255,255,255,0.3)",
  MozBoxShadow: "inset 0 -1px 1px rgba(255,255,255,0.3)",
  boxShadow: "inset 0 -1px 1px rgba(255,255,255,0.3)"
};

const styles = (width, status) => {
  return {
    backgroundColor:
      status && status === "correct_attempts"
        ? "#26a69a"
        : "rgba(235, 77, 128, 1)",
    textAlign: "center",
    float: !status || status === "correct_attempts" ? "left" : "right",
    width: `${width}%`,
    height: "100%",
    borderRadius: "10px",
    display: "block",
    borderTopRightRadius: width !== "100" ? "5px" : "10px",
    borderBottomRightRadius: width !== "100" ? "5px" : "10px",
    backgroundImage:
      "linear-gradient(center bottom,rgb(43,194,83) 37%,rgb(84,240,84) 69%)",
    boxShadow:
      "inset 0 2px 9px  rgba(255,255,255,0.3),inset 0 -2px 6px rgba(0,0,0,0.4)",
    overflow: "hidden"
  };
};

const incompleted = width => {
  return {
    textAlign: "center",
    float: "right",
    width: `${width}%`,
    height: "100%",
    display: "block",
    overflow: "hidden"
  };
};

function getPercentageValues(data) {
  let { allQuestions, hasAnswered, allAttempts, correctAttempts } = data;
  hasAnswered = (hasAnswered * 100) / allQuestions;
  correctAttempts = (correctAttempts * 100) / allAttempts;
  hasAnswered = Math.round(hasAnswered);
  const correctPercent = Math.round(correctAttempts);
  const wrongPercent = 100 - correctPercent;

  return { hasAnswered, correctPercent, wrongPercent };
}

const ProgressBar = props => {
  const { hasAnswered, correctPercent, wrongPercent } = getPercentageValues(
    props.data
  );
  const { correctAttempts, allAttempts } = props.data;
  const wrongAttempts = allAttempts - correctAttempts;
  const [completed, setCompleted] = useState(0);
  const timer = setTimeout(() => progress(10), 30);
  const min = 100 - (hasAnswered || 0);

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  function progress(completion) {
    let done = 0;
    setCompleted(() => {
      const current = completed;
      const max = hasAnswered;

      if (current + completion >= max) {
        done += 1;
      }
      return Math.min(current + completion, max);
    });
    // if (done < 1) {
    //   setTimeout(() => progress(3), 30);
    // }
  }
  return (
    <div>
      <div style={meter}>
        <span style={styles(completed)}>
          <Tooltip title={`Goede pogingen ${correctAttempts}`}>
            <span style={styles(correctPercent, "correct_attempts")} />
          </Tooltip>
          <Tooltip title={`Fouten ${wrongAttempts}`}>
            <span style={styles(wrongPercent, "wrong_attempts")} />
          </Tooltip>
        </span>

        <span style={incompleted(min)}>{min}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;

ProgressBar.propTypes = {
  data: PropTypes.object.isRequired
};
