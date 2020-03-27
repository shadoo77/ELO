import React, { useState } from "react";
import { Link } from "react-router-dom";
//Component
import ExpandedRow from "./ExpansionRow";
import TableData from "./TableData";
import SearchBox from "../../shared/inputs/expand-searchbox";
// Material ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Box,
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
// Services
import { routeUrls } from "services/config";
import { getChildrenOfItem } from "services/searchInTree";
import { searchAndFilter } from "services/results-filters";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: "100%"
  },
  cellStyle: {
    width: ({ cellWidth }) => `${cellWidth}%`
  }
}));

export default ({ data, tree, groupId, branchId, depthLevel, studentName }) => {
  const titleRow = getChildrenOfItem(tree, branchId);
  const cellsCount = titleRow.length || 0;
  const cellWidth = Math.round(cellsCount);
  const classes = useStyles({ cellWidth });
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
    <div className={classes.root}>
      {studentName ? null : <Box p={3}>{searchFilter()}</Box>}
      <Table className={classes.table}>
        {depthLevel === "alfa" || depthLevel === "thema" ? (
          <TableHead style={{ backgroundColor: "yellow" }}>
            <TableRow>
              {!studentName ? <TableCell>Studenten</TableCell> : null}
              {titleRow &&
                titleRow.length &&
                titleRow.map((el, i) => (
                  <TableCell
                    align="center"
                    key={"title" + i + el.id}
                    className={classes.cellStyle}
                    style={{
                      backgroundColor: "orange",
                      border: "1px solid",
                      padding: 5
                    }}
                  >
                    <Link
                      to={`${routeUrls.teacher.group.statusTest}/${groupId}/branch/${el.id}`}
                    >
                      <div>{el.value}</div>
                    </Link>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {!filteredData.length ? (
            <TableRow>
              <TableCell colSpan={titleRow.length + 1}>
                <Typography>
                  Er zijn geen student die zijn naam bevat {filter}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((item, i) => (
              <TableRow key={item._id}>
                {!studentName ? (
                  <TableCell component="th" scope="row">
                    <ListItem style={{ padding: 0 }}>
                      <ListItemAvatar>
                        <Avatar style={{ backgroundColor: "#555" }}>
                          {item.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={item.name} />
                    </ListItem>
                  </TableCell>
                ) : null}
                <TableCell
                  align="right"
                  colSpan={titleRow.length}
                  style={{ padding: 0 }}
                >
                  <ExpandedRow>
                    <TableData
                      tree={tree}
                      groupId={groupId}
                      branchId={branchId}
                      studentId={item._id}
                      studentName={item.name}
                      statisticsData={item.slideShows}
                      groupRender={!studentName ? true : false}
                    />
                  </ExpandedRow>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
