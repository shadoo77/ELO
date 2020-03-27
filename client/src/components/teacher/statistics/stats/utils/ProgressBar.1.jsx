// import React from "react";
// // Material Ui components
// import { Box } from "@material-ui/core/";
// import { makeStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles({
//   container: {
//     width: "100%",
//     height: "50px",
//     backgroundColor: ({ isActive }) =>
//       isActive ? "rgb(250, 250, 250)" : "#FAFAFA",
//     //border: "solid #ccc 1px",
//     borderRadius: 2,
//     padding: 0,
//     position: "relative"
//   },
//   progress: {
//     borderRadius: 2,
//     backgroundColor: "#cb2026",
//     margin: 0,
//     padding: 0,
//     width: `100%`,
//     //height: ({ totalProgress }) => `${totalProgress}%`,
//     position: "absolute",
//     transition: "height 1s",
//     WebkitTransition: "height 1s",
//     bottom: 0,
//     left: 0,
//     right: 0
//   },
//   correct: {
//     backgroundColor: "#48b648",
//     //height: ({ correct }) => `${correct}%`,
//     position: "absolute",
//     transition: "height 1s",
//     WebkitTransition: "height 1s",
//     width: "100%",
//     bottom: 0,
//     left: 0,
//     right: 0
//   }
// });

// export default function(props) {
//   const { correct, wrong, isActive } = props;
//   const totalProgress = correct + wrong;
//   const classes = useStyles({ totalProgress, correct, wrong, isActive });

//   return (
//     <Box className={classes.container}>
//       <div className={classes.progress} style={{ height: `${totalProgress}%` }}>
//         {/****** Here is just correct dev cuz the rest is wrong */}
//       </div>
//       <div className={classes.correct} style={{ height: `${correct}%` }}></div>
//     </Box>
//   );
// }

import React from "react";
// Material Ui components
import { Box } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    width: "100%",
    borderRadius: 2,
    padding: 0,
    position: "relative"
  },
  progress: {
    borderRadius: 2,
    backgroundColor: "#cb2026",
    margin: 0,
    padding: 0,
    position: "absolute"
  },
  correct: {
    backgroundColor: "#48b648",
    position: "absolute"
  },
  horizontaAlign: {
    transition: "width 1s",
    WebkitTransition: "width 1s",
    top: 0,
    bottom: 0,
    left: 0
  },
  verticalAlign: {
    transition: "height 1s",
    WebkitTransition: "height 1s",
    bottom: 0,
    left: 0,
    right: 0
  }
});

export default function(props) {
  const { correct, wrong, isActive, alignment } = props;
  const totalProgress = correct + wrong;
  const classes = useStyles({ totalProgress, correct, wrong, isActive });

  return (
    <Box
      className={classes.container}
      style={{
        backgroundColor: isActive ? "#eaeaea" : "#FAFAFA", // rgb(250, 250, 250)
        height: alignment === "vertical" ? 50 : 30
      }}
    >
      <div
        className={`${classes.progress} ${
          alignment === "vertical"
            ? classes.verticalAlign
            : classes.horizontaAlign
        }`}
        style={{
          height: alignment === "vertical" ? `${totalProgress}%` : "100%",
          width: alignment === "vertical" ? "100%" : `${totalProgress}%`
        }}
      >
        {/****** Here is just correct dev cuz the rest is wrong */}
      </div>
      <div
        className={`${classes.correct} ${
          alignment === "vertical"
            ? classes.verticalAlign
            : classes.horizontaAlign
        }`}
        style={{
          height: alignment === "vertical" ? `${correct}%` : "100%",
          width: alignment === "vertical" ? "100%" : `${correct}%`
        }}
      ></div>
    </Box>
  );
}
