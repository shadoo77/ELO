import React from "react";
// Utils
import { convertSecondsToTimestamp } from "../utils/time";
// Material UI
import Tooltip from "@material-ui/core/Tooltip";

export function toolTipPercentage(props) {
  const { children, open, value } = props;

  const popperRef = React.useRef(null);
  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip
      PopperProps={{
        popperRef
      }}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={`${value}%`}
    >
      {children}
    </Tooltip>
  );
}

export function toolTipTimestamp(props) {
  const { children, open, value } = props;

  const popperRef = React.useRef(null);
  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip
      PopperProps={{
        popperRef
      }}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={convertSecondsToTimestamp(value)}
    >
      {children}
    </Tooltip>
  );
}
