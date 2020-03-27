import React, { useState } from "react";
import Chart from "./chart/";
// Import helpers functions
import {
  extractAllSlides,
  numberOfAnswers,
  slidesDetails
} from "./helpers";
// Material Ui components
import { makeStyles } from "@material-ui/core/styles";
import {
  Collapse,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Grid,
  Avatar,
  Tooltip,
  Box
} from "@material-ui/core/";
import { ExpandMore } from "@material-ui/icons/";
// Import styling from theme
import { statusTable } from "../../shared/Theme";

const useStyles = makeStyles(statusTable);

export default props => {
  const { data } = props;
  const classes = useStyles();
  const [showChart, setChart] = useState(true);
  const [expanded, setExpanded] = useState(true);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };

  const toggleCollaps = () => {
    setChart(prev => !prev);
  };

  const { slideShows } = data[0];
  let slides = [];
  if (slideShows && slideShows.length) {
    slides = extractAllSlides(slideShows);
  }

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
        {data.map((tile, i) => {
          //console.log("tile ::: ", tile);
          return (
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
              <Tooltip title={tile.submitTime}>
                <section
                  className={classes.imageWrapper}
                  style={{
                    backgroundColor: tile.isAccepted
                      ? "#00695c"
                      : "#f50057"
                  }}
                >
                  {/* <Avatar
                    alt="Remy Sharp"
                    //{${process.env.PUBLIC_URL}/images/${props.answer.items[0].value}}
                    src={`${process.env.PUBLIC_URL}/images/${props.answer.items[0].value}`}
                    className={classes.bigAvatar}
                  /> */}
                </section>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const showQuestionsDetails = slides => {
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
    <Box
      width={9 / 10}
      p={{ xs: 1, sm: 2, md: 3 }}
      mx="auto"
      display="flex"
      flexDirection="column"
      flexWrap="wrap"
      justifyContent="center"
    >
      <Box width={1}>
        <Chart questions={slides} />
      </Box>
      <Box width={1}>
        <Collapse in={showChart} style={{ marginTop: 10 }}>
          <div elevation={4} className={classes.paper}>
            {showQuestionsDetails(slides)}
          </div>
        </Collapse>
      </Box>
    </Box>
  );
};
