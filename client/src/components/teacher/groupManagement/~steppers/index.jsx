import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography
} from "@material-ui/core/";
// Import steps ( Components )
import Step1 from "./step1";
import Step2 from "./step2";

const useStyles = makeStyles(theme => ({
  root: {
    width: "90%"
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  }
}));

function getSteps() {
  return ["Maak een nieuwe groep", "Voeg een student toe", "Afmaken"];
}

export default function VerticalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const [groupId, setGroupId] = React.useState("");

  const steps = getSteps();
  const activeNext = {};
  steps.forEach(el => {
    activeNext[el] = false;
  });
  const [activeNextButton, setActiveNextButton] = React.useState(activeNext);

  function handleNext() {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  function handleReset() {
    setActiveStep(0);
    setGroupId("");
    setActiveNextButton(activeNext);
  }

  const getGroupId = newGroup => {
    setGroupId(newGroup._id);
    setActiveNextButton({
      ...activeNextButton,
      [steps[0]]: true
    });
  };

  function getStepContent(step, groupId) {
    switch (step) {
      case 0:
        return (
          <Step1 getGroupId={getGroupId} done={activeNextButton[steps[0]]} />
        );
      case 1:
        return <Step2 groupId={groupId} />;
      case 2:
        return `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`;
      default:
        return "Unknown step";
    }
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography component="div">
                {getStepContent(0, groupId)}
              </Typography>
              <Typography component="div">
                {getStepContent(1, groupId)}
              </Typography>
              <Typography component="div">
                {getStepContent(2, groupId)}
              </Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                    disabled={!activeNextButton[label] ? true : false}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}
