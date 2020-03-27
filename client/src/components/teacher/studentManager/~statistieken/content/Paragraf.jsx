import React from "react";
// Material Ui components
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography } from "@material-ui/core/";
// Import components
import ProgressBar from "../ProgressBar";
// Import helpers functions
import {
  getQuestionCount,
  hasAnswered,
  getAttempts,
  correctOrWrongAttempts
} from "../helpers";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 1),
    width: "100%"
  }
}));

export default function(props) {
  const { slideshows } = props;

  const classes = useStyles();

  const renderProgressBarForEachSlideshow = slideshows => {
    if (slideshows && slideshows.length) {
      return slideshows.map((slideshow, i) => {
        return (
          <Grid item xs={12} key={i + slideshow._id}>
            <Paper className={classes.root}>
              <Typography variant="h5" component="h3">
                {"Opdracht " + (i + 1)}
              </Typography>
              <Typography component="div">
                <ProgressBar
                  data={{
                    allQuestions: getQuestionCount(slideshow.slides),
                    hasAnswered: hasAnswered(slideshow.slides),
                    allAttempts: getAttempts(slideshow.slides).length,
                    correctAttempts: correctOrWrongAttempts(
                      slideshow.slides,
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
      <h2>Paragraf</h2>
      {renderProgressBarForEachSlideshow(slideshows || [])}
    </Grid>
  );
}
