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
  const { slideshows, tree, diffId } = props;
  const themas = getChildrenOfItem(tree, diffId);

  const classes = useStyles();

  // Render progress bar for each paragraf
  const renderProgressBarForEachThema = slideshows => {
    if (themas && themas.length) {
      return themas.map((thema, i) => {
        const paragrafs = getChildrenOfItem(tree, thema.id);
        let slideshowOf = [];
        let slides;
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

        return (
          <Grid item xs={12} key={i + thema.id}>
            <Paper className={classes.root}>
              <Typography variant="h5" component="h3">
                {thema.value}
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
      <h2>Difficulty</h2>
      {renderProgressBarForEachThema(slideshows || [])}
    </Grid>
  );
}
