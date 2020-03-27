import React from "react";
import { withRouter } from "react-router-dom";
// Components
import { CustomButtonContent } from "components/student/player/components/buttons";
// Services
import {
  apiUrl,
  userRoles,
  routeUrls,
  tagLevels,
  difficultyTypes
} from "services/config";
import { userService } from "services/user";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, Link } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
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
  faBook,
  faStar as faStarSolid,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { faHandshake, faStar } from "@fortawesome/fontawesome-free-regular";

const useStyles = makeStyles((theme) =>
  createStyles({
    flexButton: {
      flex: "0 0 auto"
    },
    sectionCrumbs: {
      flex: "1 0"
    },
    sectionLogout: {
      flex: "0 0"
    },
    "@keyframes SlideUp": {
      "0%": {
        backgroundSize: "100% 0%"
      },

      "100%": {
        backgroundSize: "100% 100%"
      }
    }
  })
);

const Header = (props) => {
  const classes = useStyles();

  const pickDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case difficultyTypes.BEGINNER:
        return faStar;
      case difficultyTypes.INTERMEDIATE:
        return faStar;
      case difficultyTypes.ADVANCED:
      default:
        return faStar;
    }
  };

  const pickThemeIcon = (name) => {
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

  const pickIcon = (level, name, color) => {
    switch (level) {
      case tagLevels.PUBLICATION:
        return generateIcon(faBook, color);
      case tagLevels.DIFFICULTY:
        return generateIcon(pickDifficultyIcon(difficultyTypes.BEGINNER));
      case tagLevels.THEME:
        return generateIcon(pickThemeIcon(name));
      case tagLevels.PARAGRAPH:
        return (
          <span
            style={{
              fontSize: 14,
              display: "flex",
              alignSelf: "center",
              fontWeight: 700,
              margin: "auto",
              textAlign: "center"
            }}
          >
            {name}
          </span>
        );
      case tagLevels.ASSIGNMENT:
        return generateIcon(faSignOutAlt);
      default:
        return generateIcon(faImage);
    }
  };

  const generateIcon = (icon) => {
    return (
      <FontAwesomeIcon
        icon={icon}
        style={{
          fontSize: 18,
          color: "rgb(250,250,250)",
          margin: "auto",
          textAlign: "center"
        }}
      />
    );
  };

  const renderLogout = (node) => {
    return (
      <CustomButtonContent
        className={classes.flexButton}
        content={
          <FontAwesomeIcon
            icon={faSignOutAlt}
            style={{
              fontSize: 25,
              transform: "scaleX(-1)"
            }}
          />
        }
        color="secondary"
        clickHandler={() => {
          userService.logout();
        }}
      />
    );
  };

  const pickUrl = (crumb) => {
    switch (crumb.__t) {
      case tagLevels.PUBLICATION:
        return `${routeUrls.student.browse.tag}/publication/${crumb._id}`;
      case tagLevels.THEME:
        return `${routeUrls.student.browse.tag}/theme/${crumb._id}`;
      default:
        return `${routeUrls.student.browse.default}`;
    }
  };

  const renderCrumb = (crumb, index) => {
    return (
      <Link
        key={`breadcrumb_link_${crumb._id}`}
        color="inherit"
        style={{ textDecoration: "none" }}
      >
        <CustomButtonContent
          className={classes.flexButton}
          content={pickIcon(crumb.__t, crumb.icon, crumb.color)}
          color="secondary"
          isDisabled={index >= props.pathNodes.length - 1}
          clickHandler={() => {
            if (index < props.pathNodes.length - 1) {
              props.history.push(pickUrl(crumb, index));
            }
          }}
        />
      </Link>
    );
  };

  const renderCrumbs = () => {
    return props.pathNodes.map((node, index) => {
      return renderCrumb(node, index);
    });
  };

  return (
    <>
      <div className={classes.sectionCrumbs}>
        <Breadcrumbs aria-label="breadcrumb">{renderCrumbs()}</Breadcrumbs>
      </div>
      <div className={classes.sectionLogout}>{renderLogout()}</div>
    </>
  );
};

export default withRouter(Header);
