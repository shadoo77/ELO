import React from "react";

//Component
import RowData from "./RowData";
// Material ui
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from "@material-ui/core/";

export default function(props) {
  const { data, diffId, tree } = props;
  return (
    <List>
      {data.map((item, i) => (
        <React.Fragment key={item._id}>
          <ListItem>
            <ListItemAvatar>
              <Avatar style={{ backgroundColor: "#555" }}>
                {item.name.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <RowData
                  tree={tree}
                  branchId={diffId}
                  studentName={item.name}
                  statisticsData={item.slideShows}
                />
              }
            />
          </ListItem>
          {i === data.length - 1 ? null : <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
}
