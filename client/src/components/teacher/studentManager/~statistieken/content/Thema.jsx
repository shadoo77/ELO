import React from "react";
// Material Ui components
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography } from "@material-ui/core/";
// Import components
import ProgressBar from "../ProgressBar";
// Import helpers functions
import {
  extractAllSlides,
  getQuestionCount,
  hasAnswered,
  getAttempts,
  correctOrWrongAttempts
} from "../helpers";
import { getChildrenOfItem } from "../../../../../services/searchInTree";
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    width: "100%"
  }
}));

export default function(props) {
  const { slideshows, tree, themaId } = props;
  const paragrafs = getChildrenOfItem(tree, themaId);

  const classes = useStyles();

  // Render progress bar for each paragraf
  const renderProgressBarForEachParagraf = slideshows => {
    if (paragrafs && paragrafs.length) {
      return paragrafs.map((paragraf, i) => {
        let slideshowOf = [];
        let slides;
        if (slideshows && slideshows.length) {
          slideshows.forEach(el => {
            if (el.entrypoint._id === paragraf.id) {
              slideshowOf.push(el);
            }
          });
          slides = extractAllSlides(slideshowOf);
        }
        return (
          <Grid item xs={12} key={i + paragraf.id}>
            <Paper className={classes.root}>
              <Typography variant="h5" component="h3">
                {paragraf.value}
              </Typography>
              <Typography component="div">
                <ProgressBar
                  data={{
                    allQuestions: getQuestionCount(slides),
                    hasAnswered: hasAnswered(slides),
                    allAttempts: getAttempts(slides).length,
                    correctAttempts: correctOrWrongAttempts(
                      slides,
                      "CORRECT_ANSWERS"
                    )
                  }}
                />
              </Typography>
            </Paper>
          </Grid>
        );
      });
    }
  };

  return (
    // Container ***************
    <Grid
      container
      item
      spacing={2}
      direction="row"
      justify="center"
      alignItems="center"
      xs={12}
      sm={11}
    >
      <h2>Thema</h2>
      {renderProgressBarForEachParagraf(slideshows || [])}
    </Grid>
  );
}
