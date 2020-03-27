import React, { useState } from "react";
//Component
import TableHeader from "./TableHeader.1";
import ExpandedRow from "./ExpandedRow";
import TableData from "./TableData.2";
import SearchBox from "../../shared/inputs/expand-searchbox";
// Material ui
import {
  Grid,
  Avatar,
  Box,
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from "@material-ui/core/";
// Services
import { getChildrenOfItem } from "services/searchInTree";
import { searchAndFilter } from "services/results-filters";

export default ({ data, tree, groupId, branchId, depthLevel, studentName }) => {
  const titleRow = getChildrenOfItem(tree, branchId);
  const [filter, setFilter] = useState("");

  // Filter search
  const filterChange = val => {
    setFilter(val);
  };

  const clearSearch = () => {
    setFilter("");
  };

  const searchFilter = () => {
    return (
      <React.Fragment>
        <SearchBox
          handleChange={filterChange}
          clearSearch={clearSearch}
          value={filter}
        />
        <Divider />
      </React.Fragment>
    );
  };

  const searchValue = filter;
  const activeState = true;
  const selectedKey = "isActivated";
  const filteredData = searchAndFilter(
    data || [],
    searchValue,
    activeState,
    selectedKey
  );

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      spacing={1}
    >
      {studentName ? null : (
        <Grid item xs={12}>
          <Box p={3}>{searchFilter()}</Box>
        </Grid>
      )}
      {/********* Table header  ***********/}
      {depthLevel === "publication" || depthLevel === "thema" ? (
        <Grid container item xs={12} spacing={1}>
          <TableHeader titleRow={titleRow} groupId={groupId} />
        </Grid>
      ) : null}

      {!filteredData.length ? (
        <Grid container item xs={12} spacing={1}>
          <Typography>
            Er zijn geen student die zijn naam bevat {filter}
          </Typography>
        </Grid>
      ) : (
        // ******************************* Content
        filteredData.map((item, i) => (
          <React.Fragment key={item._id}>
            <Grid container item xs={12} spacing={1}>
              <Grid item container xs={12}>
                {!studentName ? (
                  <ExpandedRow
                    header={
                      <ListItem style={{ padding: 0 }}>
                        <ListItemAvatar>
                          <Avatar style={{ backgroundColor: "#555" }}>
                            {item.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.name} />
                      </ListItem>
                    }
                  >
                    <TableData
                      tree={tree}
                      groupId={groupId}
                      branchId={branchId}
                      studentId={item._id}
                      studentName={item.name}
                      statisticsData={item.slideShows}
                      depthLevel={depthLevel}
                    />
                  </ExpandedRow>
                ) : (
                  <TableData
                    tree={tree}
                    groupId={groupId}
                    branchId={branchId}
                    studentId={item._id}
                    studentName={item.name}
                    statisticsData={item.slideShows}
                    depthLevel={depthLevel}
                  />
                )}
              </Grid>
            </Grid>
            {i === filteredData.length - 1 ? null : (
              <Box px={2} width={1}>
                <Divider />
              </Box>
            )}
          </React.Fragment>
        ))
      )}
    </Grid>
  );
};
