import React, { useState } from "react";
import { statusTable } from "../../../../shared/Theme";
//import { answerTypes } from "../../../../services/config";
// Components
// Material Ui components
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Collapse,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Grid,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Link
} from "@material-ui/core/";
import {
  ExpandLess,
  ExpandMore
} from "@material-ui/icons/";

// Import components
import ProgressBar from "../ProgressBar";
import ChartBar from "../chart";

// Import helpers functions
import {
  extractAllSlides,
  numberOfAnswers,
  getQuestionCount,
  hasAnswered,
  hasNotAnswerd,
  slidesDetails,
  getAttempts,
  correctOrWrongAttempts
} from "../helpers";

const useStyle = makeStyles(statusTable);

/////// The component //////////////////
export default function(props) {
  const { slideshows } = props;

  let slides;
  if (slideshows && slideshows.length) {
    slides = extractAllSlides(slideshows);
  } else {
    slides = props.slides;
  }
  const classes = useStyle();

  const [showChart, setChart] = useState(false);

  const toggleCollaps = () => {
    setChart(prev => !prev);
  };

  const [expanded, setExpanded] = useState(true);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };

  const answersSlides = data => {
    return (
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.gridListWrapper}
      >
        {data.map((tile, i) => (
          <Grid
            item
            container
            justify="center"
            alignItems="center"
            lg={1}
            md={2}
            sm={3}
            xs={4}
            key={"avatar" + i}
          >
            <section
              className={classes.imageWrapper}
              style={{
                backgroundColor: tile.isAccepted
                  ? "#00695c"
                  : "#f50057"
              }}
            >
              <Avatar
                alt={tile.imgSrc}
                src={require(`${process.env.PUBLIC_URL}/${tile.imgSrc}`)}
                className={classes.bigAvatar}
              />
            </section>
          </Grid>
        ))}
      </Grid>
    );
  };

  const showQuestionsDetails = slides => {
    // Filter slides in order to choose all questions except info_slides
    const items = slides.filter(
      item => item.__t !== "info_slide"
    );
    return items.map((slide, i) => (
      <ExpansionPanel
        key={"slide-" + slide._id + i}
        expanded={expanded === slide._id}
        onChange={handleChange(slide._id)}
        style={{ backgroundColor: "#e8e8e8" }}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.heading}>
            Vraag {i + 1}
          </Typography>
          <Typography className={classes.secondaryHeading}>
            {slide.name}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          style={{ backgroundColor: "white" }}
        >
          {slide.__t === "info_slide" ? (
            <Typography>
              Deze slide is info slide.
            </Typography>
          ) : slide.__t === "hotspot_slide" ? (
            <Typography>
              Deze slide is hotspot slide, de student heeft{" "}
              {slide.clickables.length} geklikt
            </Typography>
          ) : (
            <Typography
              style={{ width: "100%" }}
              component="span"
              variant="body2"
            >
              De student heeft {slide.interactions.length}{" "}
              pogingen ,
              <span style={{ color: "#00695c" }}>
                <strong>
                  {numberOfAnswers(
                    slide.interactions || [],
                    "CORRECT_ANSWERS"
                  )}{" "}
                  goede{" "}
                </strong>
              </span>
              antwoorden, en{" "}
              <span style={{ color: "#f50057" }}>
                <strong>
                  {numberOfAnswers(
                    slide.interactions || [],
                    "WRONG_ANSWERS"
                  )}{" "}
                  niet{" "}
                </strong>
              </span>
              goede antwoorden.
              <br />
              {answersSlides(slidesDetails(slide))}
            </Typography>
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ));
  };

  return (
    // Container ***************
    <Grid
      container
      item
      spacing={0}
      direction="row"
      justify="center"
      alignItems="center"
      xs={12}
      sm={11}
    >
      {/* // Progress grid *************** */}
      <Grid item xs={12}>
        <div style={{ width: "100%" }}>
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
        </div>
      </Grid>
      {/* // Statistics questions grid *************** */}
      <Paper className={classes.root}>
        <Grid
          item
          container
          xs={12}
          spacing={3}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12} sm={4}>
            <ListItem>
              <ListItemText
                primary="Aantal vragen"
                secondary={getQuestionCount(slides)}
              />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  style={{ backgroundColor: "#555" }}
                />
              </ListItemAvatar>
              <ListItemText
                primary="Onbeantwoord"
                secondary={hasNotAnswerd(slides)}
              />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ListItem>
              <ListItemText
                primary="Beantwoord"
                secondary={hasAnswered(slides)}
              />
            </ListItem>
          </Grid>
        </Grid>
      </Paper>
      {/* // Statistics attempts grid *************** */}
      {hasAnswered(slides) < 1 ? null : (
        <Paper className={classes.root}>
          <Grid
            item
            container
            xs={12}
            spacing={3}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12} sm={4}>
              <ListItem>
                <ListItemText
                  primary="Aantal pogingen"
                  secondary={getAttempts(slides).length}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    className={classes.correctColor}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Goede pogingen"
                  secondary={correctOrWrongAttempts(
                    slides,
                    "CORRECT_ANSWERS"
                  )}
                />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={classes.wrongColor} />
                </ListItemAvatar>
                <ListItemText
                  primary="Verkeerde pogingen"
                  secondary={correctOrWrongAttempts(
                    slides,
                    "WRONG_ANSWERS"
                  )}
                />
              </ListItem>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <ListItem>
              <Link
                component="button"
                variant="body2"
                onClick={() => toggleCollaps()}
              >
                {showChart ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
                Klik hier om meer details te bekijken
              </Link>
            </ListItem>
          </Grid>
        </Paper>
      )}

      <Collapse in={showChart} style={{ marginTop: 10 }}>
        <div elevation={4} className={classes.paper}>
          {showQuestionsDetails(slides)}
        </div>
      </Collapse>
      <ChartBar questions={slides} />
    </Grid>
  );
}
