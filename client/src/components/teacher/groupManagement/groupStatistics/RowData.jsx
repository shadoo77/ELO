import React from "react";
// Services
import { getChildrenOfItem } from "services/searchInTree";
import { tagLevels } from "services/config";
// Material ui
import { Grid, Tooltip } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
// Import helpers functions
import {
  extractAllSlides,
  getQuestionCount,
  hasAnswered
} from "../../studentManager/~statistieken/helperss";
// Chart bar
import ProgressBar from "./ProgressBar";

const useStyles = makeStyles((theme) => ({
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

export default (props) => {
  const classes = useStyles();
  const { statisticsData, studentName, tree, branchId } = props;
  const children =
    tree && branchId ? getChildrenOfItem(tree, branchId) : undefined;
  // Render progress bar for each paragraf
  const renderProgressBarForEachParagraf = (slideshows) => {
    if (children && children.length) {
      return children.map((child, i) => {
        let slideshowOf = [];
        let slides;
        // This because we can't extract our slideshows on another depth level
        // Just on paragraf level
        if (child.__t === tagLevels.THEME) {
          const paragrafs = getChildrenOfItem(tree, child.id);
          paragrafs.forEach((paragraf) => {
            if (slideshows && slideshows.length) {
              slideshows.forEach((el) => {
                if (el.entrypoint._id === paragraf.id) {
                  slideshowOf.push(el);
                }
              });
              slides = extractAllSlides(slideshowOf);
            }
          });
        } else {
          if (slideshows && slideshows.length) {
            slideshows.forEach((el) => {
              if (el.entrypoint._id === child.id) {
                slideshowOf.push(el);
              }
            });
            slides = extractAllSlides(slideshowOf);
          }
        }

        const allQuestions = getQuestionCount(slides);
        const hasAnsweredNum = hasAnswered(slides);
        return (
          <Grid item xs className={classes.cellStyle} key={"heeey" + i}>
            <Tooltip title={child.value}>
              <div>
                <ProgressBarItem
                  allQuestions={allQuestions}
                  hasAnswered={hasAnsweredNum}
                />
              </div>
            </Tooltip>
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
              <Tooltip title={slideshow.name}>
                <div>
                  <ProgressBarItem
                    allQuestions={allQuestions}
                    hasAnswered={hasAnsweredNum}
                  />
                </div>
              </Tooltip>
            </Grid>
          );
        });
      }
    }
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container spacing={1} justify="center" alignItems="center">
        <Grid item xs={3} sm={2} style={{ padding: 0 }}>
          {studentName}
        </Grid>
        <Grid
          item
          container
          xs={9}
          sm={10}
          spacing={1}
          className={classes.table}
        >
          {renderProgressBarForEachParagraf(statisticsData)}
        </Grid>
      </Grid>
    </div>
  );
};
