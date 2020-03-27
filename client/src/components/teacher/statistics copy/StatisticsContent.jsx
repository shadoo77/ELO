import React from "react";
//Component
import RowData from "./RowData";
import TitleRow from "./TitleRow";
// Material ui
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from "@material-ui/core/";
// Services
import { getChildrenOfItem } from "services/searchInTree";

export default ({ data, tree, branchId, depthLevel, studentName }) => {
  const titleRow = getChildrenOfItem(tree, branchId);
  return (
    <div>
      <List component="nav">
        {depthLevel === "alfa" || depthLevel === "thema" ? (
          <ListItem>
            <ListItemAvatar>
              <Avatar style={{ visibility: "hidden" }}>&nbsp;</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <TitleRow
                  data={titleRow}
                  groupRender={!studentName ? true : false}
                />
              }
            />
          </ListItem>
        ) : null}
        {data.map((item, i) => (
          <React.Fragment key={item._id}>
            <ListItem button style={{ cursor: "default" }}>
              {!studentName ? (
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: "#555" }}>
                    {item.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
              ) : null}
              <ListItemText
                primary={
                  <RowData
                    tree={tree}
                    branchId={branchId}
                    studentId={item._id}
                    studentName={item.name}
                    statisticsData={item.slideShows}
                    groupRender={!studentName ? true : false}
                  />
                }
              />
            </ListItem>
            {i === data.length - 1 ? null : <Divider />}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};
