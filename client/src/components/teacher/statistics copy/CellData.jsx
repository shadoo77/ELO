import React from "react";
import { withRouter, Link } from "react-router-dom";
// Services
import { getChildrenOfItem } from "services/searchInTree";
import { routeUrls } from "services/config";
// Material ui
import {
  Grid,
  Tooltip,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
// Import helpers functions
import { extractAllSlides, getQuestionCount, hasAnswered } from "./helpers";
// Chart bar
import ProgressBar from "./ProgressBar";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  table: {
    flexGrow: 1,
    width: "100%",
    padding: 0
  },
  cellStyle: {
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

const ProgressBarItem = React.forwardRef((props, ref) => (
  <ProgressBar {...props} ref={ref} />
));

function CellData(props) {
  const classes = useStyles();
  const { tree, branchId, data, studentId } = props;
  const { groupId } = props.match.params;

  const children =
    tree && branchId ? getChildrenOfItem(tree, branchId) : undefined;
  // Render progress bar for each paragraf
  const renderProgressBarForEachItem = slideshows => {
    if (children && children.length) {
      return children.map((child, i) => {
        let slideshowOf = [];
        let slides;
        // This because we can't extract our slideshows on another depth level
        // Just on paragraf level
        if (child.depthLevel === "thema") {
          const paragrafs = getChildrenOfItem(tree, child.id) || [];
          paragrafs.forEach(paragraf => {
            if (slideshows && slideshows.length) {
              slideshows.forEach(el => {
                if (el.entrypoint._id === paragraf.id) {
                  slideshowOf.push(el);
                }
              });
              slides = extractAllSlides(slideshowOf);
            }
          });
        } else if (child.depthLevel === "paragraf") {
          if (slideshows && slideshows.length) {
            slideshows.forEach(el => {
              if (el.entrypoint._id === child.id) {
                slideshowOf.push(el);
              }
            });
            slides = extractAllSlides(slideshowOf);
          }
        }

        const allQuestions = getQuestionCount(slides || []);
        const hasAnsweredNum = hasAnswered(slides || []);
        return (
          <Grid item xs className={classes.cellStyle} key={"heeey" + i}>
            <Link
              to={`${routeUrls.teacher.group.statusTest}/${groupId}/branch/${child.id}/student/${studentId}`}
            >
              <Tooltip title={child.value}>
                <div>
                  <ProgressBarItem
                    allQuestions={allQuestions}
                    hasAnswered={hasAnsweredNum}
                  />
                </div>
              </Tooltip>
            </Link>
          </Grid>
        );
      });
    } else {
      if (slideshows && slideshows.length) {
        return slideshows.map((slideshow, i) => {
          const allQuestions = getQuestionCount(slideshow.slides);
          const hasAnsweredNum = hasAnswered(slideshow.slides);
          return (
            <Grid item xs className={classes.cellStyle} key={slideshow._id}>
              <Link
                to={`${routeUrls.teacher.group.statusTest}/${groupId}/branch/${slideshow._id}/student/${studentId}`}
              >
                <Tooltip title={slideshow.name}>
                  <div>
                    <ProgressBarItem
                      allQuestions={allQuestions}
                      hasAnswered={hasAnsweredNum}
                    />
                  </div>
                </Tooltip>
              </Link>
            </Grid>
          );
        });
      }
    }
  };

  return (
    <>
      <List style={{ width: "100%" }}>
        {data.map((item, i) => (
          <ListItem key={"dataStructure " + i} style={{ padding: 0 }}>
            <ListItemText
              primary={
                <div className={classes.root}>
                  <Grid
                    container
                    spacing={1}
                    justify="center"
                    alignItems="center"
                  >
                    <Grid item xs={1} style={{ padding: 0 }}>
                      {item.level}
                    </Grid>
                    <Grid
                      item
                      container
                      xs={11}
                      spacing={1}
                      className={classes.table}
                    >
                      {renderProgressBarForEachItem(item.data)}
                    </Grid>
                  </Grid>
                </div>
              }
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default withRouter(CellData);
