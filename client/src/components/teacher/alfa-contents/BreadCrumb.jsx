import React from "react";
// Services
import { alfaContentLevels } from "services/config";
import { historyService } from "services/history";
// Material ui
import { makeStyles } from "@material-ui/core/styles";
import { Link, Breadcrumbs, Typography, Paper } from "@material-ui/core/";
import HomeIcon from "@material-ui/icons/Home";
import DescriptionIcon from "@material-ui/icons/Description";
import AssignmentIcon from "@material-ui/icons/Assignment";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import GrainIcon from "@material-ui/icons/Grain";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 2)
  },
  link: {
    display: "flex",
    cursor: "pointer"
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20
  }
}));

function handleClick(url) {
  historyService.push(url);
}

function BreadIcon({ iconEmo: IconEmo, ...other }) {
  return <IconEmo {...other} />;
}

export default ({ data }) => {
  const classes = useStyles();
  const lastItem = data.pop();

  const getIcon = type => {
    switch (type) {
      case alfaContentLevels.PUBLICATION:
        return <BreadIcon iconEmo={HomeIcon} className={classes.icon} />;
      case alfaContentLevels.THEME:
        return <BreadIcon iconEmo={DescriptionIcon} className={classes.icon} />;
      case alfaContentLevels.PARAGRAPH:
        return <BreadIcon iconEmo={AssignmentIcon} className={classes.icon} />;
      case alfaContentLevels.SUB_PARAGRAPH:
        return <BreadIcon iconEmo={WhatshotIcon} className={classes.icon} />;
      case alfaContentLevels.VIDEO_CATEGORY:
        return <BreadIcon iconEmo={GrainIcon} className={classes.icon} />;
      case alfaContentLevels.TAALBEAT_CATEGORY:
        return <BreadIcon iconEmo={HomeIcon} className={classes.icon} />;
      case alfaContentLevels.LIEDJE_CATEGORY:
        return <BreadIcon iconEmo={HomeIcon} className={classes.icon} />;
      case alfaContentLevels.AUDIOFRAGMENT_CATEGORY:
        return <BreadIcon iconEmo={HomeIcon} className={classes.icon} />;
      case alfaContentLevels.PAR_VID_CATEGORY:
        return <BreadIcon iconEmo={HomeIcon} className={classes.icon} />;
      case alfaContentLevels.PAR_TAALBEAT_CATEGORY:
        return <BreadIcon iconEmo={HomeIcon} className={classes.icon} />;
      case alfaContentLevels.PAR_LIEDJE_CATEGORY:
        return <BreadIcon iconEmo={HomeIcon} className={classes.icon} />;
      case alfaContentLevels.PAR_AUDFR_CATEGORY:
        return <BreadIcon iconEmo={HomeIcon} className={classes.icon} />;
      default:
        return;
    }
  };

  return (
    <Paper elevation={0} className={classes.root}>
      <Breadcrumbs aria-label="breadcrumb">
        {data.length
          ? data.map(el => (
              <Link
                key={el._id}
                color="inherit"
                onClick={() => handleClick(el.url)}
                className={classes.link}
              >
                {getIcon(el.depth)}
                {el.value}
              </Link>
            ))
          : null}
        {lastItem ? (
          <Typography color="textPrimary">
            {getIcon(lastItem.depth)}
            {lastItem.value}
          </Typography>
        ) : null}
      </Breadcrumbs>
    </Paper>
  );
};
