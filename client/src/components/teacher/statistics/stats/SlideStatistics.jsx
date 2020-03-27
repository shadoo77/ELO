import React, { useState, useEffect } from "react";
import { useResource } from "rest-hooks";
import Chart from "./utils/chart/";
// Shape
import AssignmentWithInteractionsResource from "shapes/interactions.shape";
// Import helpers functions
import { extractAllSlides, numberOfAnswers, slidesDetails } from "../helpers";
// Services
import {
  routeUrls,
  difficultyTypes,
  slideTypes,
  bucketUrl
} from "services/config";
import { backendService } from "services/backend";
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
import { statusTable } from "../../../shared/Theme";

const useStyles = makeStyles(statusTable);

export default props => {
  const { assignmentId, studentId } = props;
  const classes = useStyles();
  //const [slides, setSlides] = useState([]);

  const [showChart, setChart] = useState(true);
  const [expanded, setExpanded] = useState(true);

  const assignment = useResource(
    AssignmentWithInteractionsResource.detailShape(),
    {
      _id: assignmentId,
      assignmentId,
      studentId
    }
  );

  // useEffect(() => {
  //   setSlides(assignment.slides);
  // }, [assignment]);

  // console.log("Slides state : ", slides);

  // async function fetchAssignment(assignmentId, studentId) {
  //   try {
  //     const assignment = await backendService.getInteractions(
  //       assignmentId,
  //       studentId
  //     );
  //     setAssignment(assignment);
  //     console.log("assignment >>>>>>>>>> ", assignment);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   fetchAssignment(assignmentId, studentId);
  // }, []);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };

  const toggleCollaps = () => {
    setChart(prev => !prev);
  };

  // const { slideShows } = data[0];
  // let slides = [];
  // if (slideShows && slideShows.length) {
  //   slides = extractAllSlides(slideShows);
  // }

  const answersSlides = data => {
    console.log(data);
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
                    backgroundColor: tile.isAccepted ? "#00695c" : "#f50057"
                  }}
                >
                  {/* <Avatar
                    alt="Remy Sharp"
                    //{${process.env.PUBLIC_URL}/images/${props.answer.items[0].value}}
                    src={`${process.env.PUBLIC_URL}/images/${props.answer.items[0].value}`}
                    className={classes.bigAvatar}
                  /> */}

                  <Avatar
                    alt={`Antwoord ${i}`}
                    // src={`${process.env.PUBLIC_URL}/images/${props.answer.items[0].value}`}
                    src={`${bucketUrl}/${tile.imgSrc}`}
                    className={classes.bigAvatar}
                  />
                </section>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const showQuestionsDetails = slides => {
    const items = slides.filter(item => item.__t !== slideTypes.INFO);
    return items.map((slide, i) => (
      <ExpansionPanel
        key={"slide-" + slide._id + i}
        expanded={expanded === slide._id}
        onChange={handleChange(slide._id)}
        style={{ backgroundColor: "#e8e8e8" }}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.heading}>Vraag {i + 1}</Typography>
          <Typography className={classes.secondaryHeading}>
            {slide.name}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ backgroundColor: "white" }}>
          {slide.__t === slideTypes.INFO ? (
            <Typography>Deze slide is info slide.</Typography>
          ) : (
            <Typography
              style={{ width: "100%" }}
              component="span"
              variant="body2"
            >
              De student heeft {slide.interactions.length} pogingen ,
              <span style={{ color: "#00695c" }}>
                <strong>
                  {numberOfAnswers(slide.interactions || [], "CORRECT_ANSWERS")}{" "}
                  goede{" "}
                </strong>
              </span>
              antwoorden, en{" "}
              <span style={{ color: "#f50057" }}>
                <strong>
                  {numberOfAnswers(slide.interactions || [], "WRONG_ANSWERS")}{" "}
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
      {assignment && assignment.slides && assignment.slides.length ? (
        <>
          <Box width={1}>
            <Chart questions={assignment.slides} />
          </Box>
          <Box width={1}>
            <Collapse in={showChart} style={{ marginTop: 10 }}>
              <div elevation={4} className={classes.paper}>
                {showQuestionsDetails(assignment.slides)}
              </div>
            </Collapse>
          </Box>
        </>
      ) : null}
    </Box>
  );
};
