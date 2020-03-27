import React, { useState } from "react";
// Material ui
import { Collapse, Box } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore, ExpandLess } from "@material-ui/icons/";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    width: "100%",
    marginTop: 8,
    marginBottom: 8
  },
  expandIcon: {
    //margin: "15px 15px 0 0"
    cursor: "pointer"
  }
});

export default props => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  function handleCollapseOpen() {
    setOpen(!open);
  }
  return (
    <div className={classes.root}>
      <Box display="flex" flexWrap="nowrap" justifyContent="space-between">
        <Box px={2}>{props.header}</Box>
        <Box px={2}>
          {open ? (
            <ExpandLess
              onClick={handleCollapseOpen}
              className={classes.expandIcon}
            />
          ) : (
            <ExpandMore
              onClick={handleCollapseOpen}
              className={classes.expandIcon}
            />
          )}
        </Box>
      </Box>

      <Box my={1} px={2}>
        <Collapse in={open} timeout="auto">
          <React.Fragment>{props.children}</React.Fragment>
        </Collapse>
      </Box>
    </div>
  );
};
