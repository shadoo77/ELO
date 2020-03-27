import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Tab, Tabs, Divider, Icon } from "@material-ui/core/";

// Components
import ActiveGroups from "./ActiveGroups";
import InActiveGroups from "./InActiveGroups";
import GroupContainer from "../../shared/group/Container";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  centerText: {
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: theme.spacing()
  }
}));

export default function ScrollableTabsButtonForce() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }
  function labelWithIcon(icon, label) {
    return (
      <Typography variant="subtitle2" className={classes.centerText}>
        <Icon className={classes.icon}>{icon}</Icon>
        {label}
      </Typography>
    );
  }

  return (
    <GroupContainer title="Groepsoverzicht" subtitle="Beheer hier alle groepen">
      <Tabs
        value={value}
        onChange={handleChange}
        //variant="fullWidth"
        scrollButtons="on"
        indicatorColor="primary"
        textColor="primary"
        aria-label="scrollable force tabs example"
        //centered
      >
        <Tab
          style={{ width: "50%" }}
          label={labelWithIcon("unarchive", "Actief")}
          {...a11yProps(0)}
        />
        <Tab
          style={{ width: "50%" }}
          label={labelWithIcon("archive", "Gearchiveerd")}
          //icon={<FavoriteIcon />}
          {...a11yProps(1)}
        />
      </Tabs>
      <Divider />
      {/* <ExpandingSearchBox /> */}

      <TabPanel value={value} index={0}>
        <ActiveGroups />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <InActiveGroups />
      </TabPanel>
    </GroupContainer>
  );
}
