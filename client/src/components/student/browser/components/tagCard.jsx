import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
// Components
import Progressbar from "./progress";
// Services
import { tagLevels } from "services/config";
// Material UI
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import { Card, CardActionArea, CardContent } from "@material-ui/core";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faUtensils,
  faCouch,
  faUserNurse,
  faImage,
  faBaby,
  faTools,
  faBusAlt,
  faTableTennis,
  faSocks,
  faBook
} from "@fortawesome/free-solid-svg-icons";
import { faHandshake } from "@fortawesome/fontawesome-free-regular";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      textAlign: "center"
    },
    contentArea: {
      minHeight: "140px",
      display: "flex",
      justifySelf: "center"
    },
    progressBar: {
      backgroundColor: "#e7e7e7",
      width: "100%",
      height: 12,
      display: "flex"
    },
    progressCorrect: { backgroundColor: "#48b648" },
    progressWrong: { backgroundColor: "#cb2026" }
  })
);

const TagCard = props => {
  const classes = useStyles();

  useEffect(() => {}, []);

  const pickThemeIcon = name => {
    switch (name) {
      case "Kennismaken":
        return faHandshake;
      case "School":
        return faGraduationCap;
      case "Eten & Drinken":
        return faUtensils;
      case "Gezondheid":
        return faUserNurse;
      case "Kleding":
        return faSocks;
      case "Wonen":
        return faCouch;
      case "Vrije tijd":
        return faTableTennis;
      case "Reizen":
        return faBusAlt;
      case "Werk":
        return faTools;
      case "Kinderen":
        return faBaby;

      default:
        return faImage;
    }
  };

  const generateIcon = icon => {
    return (
      <FontAwesomeIcon
        icon={icon}
        style={{
          color: `rgb(${props.color})`,
          fontSize: "4rem",
          margin: "auto",
          textAlign: "center"
        }}
      />
    );
  };
  console.log(props.icons);
  const pickIcon = (level, icon, color) => {
    switch (level) {
      case tagLevels.PUBLICATION:
        return generateIcon(faBook);
      case tagLevels.THEME:
        return generateIcon(pickThemeIcon(icon));
      case tagLevels.PARAGRAPH:
        return (
          <span
            style={{
              fontSize: 28,
              color: `rgb(${color})`,
              margin: "auto",
              textAlign: "center"
            }}
          >
            {icon}
          </span>
        );
      case tagLevels.ASSIGNMENT:
        return (
          <span
            style={{
              fontSize: 28,
              color: `rgb(${color})`,
              margin: "auto",
              textAlign: "center"
            }}
          >
            {icon}
          </span>
        );
      default:
        return generateIcon(faImage);
    }
  };

  return (
    <Card
      onClick={() => {
        setTimeout(() => {
          props.history.push(props.url);
        }, 0);
      }}
      className={classes.root}
    >
      <CardActionArea>
        <CardContent className={classes.contentArea}>
          {pickIcon(props.depthLevel, props.icon, props.color)}
        </CardContent>
      </CardActionArea>
      {props.depthLevel === tagLevels.ASSIGNMENT ? (
        <div className={classes.progressBar}>
          <div
            className={classes.progressCorrect}
            style={{ width: `${props.correct}%` }}
          ></div>
          <div
            className={classes.progressWrong}
            style={{ width: `${props.wrong}%` }}
          ></div>
        </div>
      ) : (
        <Progressbar progress={props.correct + props.wrong} />
      )}
    </Card>
  );
};

export default withRouter(TagCard);
