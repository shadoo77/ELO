import React from "react";
import { Link } from "react-router-dom";
// Services
import { getChildrenOfItem } from "services/searchInTree";
import { routeUrls } from "services/config";
import { difficultyTypes } from "services/config";
// Import helpers functions
import { extractAllSlides, getQuestionCount, hasAnswered } from "./helpers";
// Chart bar
import ProgressBar from "./ProgressBar.1";
// Material ui
import { Grid, Tooltip } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "auto"
  },
  itemsBarContainer: {
    flexWrap: "nowrap"
  },
  cellStyle: {
    width: "50px",
    flexShrink: 0,
    padding: 5,
    "&:last-child": {
      paddingRight: 5
    }
  }
});

const ProgressBarItem = React.forwardRef((props, ref) => (
  <ProgressBar {...props} ref={ref} />
));

function getDataInLevels(data) {
  const easyData = data.filter(
    el => el.difficulty === difficultyTypes.BEGINNER
  );
  const normalData = data.filter(
    el => el.difficulty === difficultyTypes.INTERMEDIATE
  );
  const hardData = data.filter(
    el => el.difficulty === difficultyTypes.ADVANCED
  );
  return [
    { level: "*", data: easyData },
    { level: "**", data: normalData },
    { level: "***", data: hardData }
  ];
}

function TableData(props) {
  const { statisticsData, tree, branchId, studentId, groupId } = props;
  const dataStructure = getDataInLevels(statisticsData);

  const children =
    tree && branchId ? getChildrenOfItem(tree, branchId) : undefined;
  const classes = useStyles();
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
          <Grid item className={classes.cellStyle} key={"heeey" + i}>
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
            <Grid className={classes.cellStyle} item key={slideshow._id}>
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
    <div className={classes.root}>
      {dataStructure.map((item, i) => (
        <Grid container item xs={12} key={"dataStructure " + i}>
          <Grid item container xs={1} justify="center" style={{ margin: 0 }}>
            {item.level}
          </Grid>
          <Grid item container xs={11} className={classes.itemsBarContainer}>
            {renderProgressBarForEachItem(item.data)}
          </Grid>
        </Grid>
      ))}
    </div>
  );
}

export default TableData;
