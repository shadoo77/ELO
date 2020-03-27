import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Icon
} from "@material-ui/core/";
import { ExpandLess, ExpandMore } from "@material-ui/icons/";

const CollapsItem = props => {
  const [itemState, setItemState] = useState({ open: false });
  const { itemtext, itemicon, children } = props;

  const handleChange = () => {
    setItemState({ ...itemState, open: !itemState.open });
  };

  return (
    <List component="nav">
      <ListItem button onClick={() => handleChange()}>
        {itemicon ? (
          <ListItemIcon>
            <Icon>{itemicon}</Icon>
          </ListItemIcon>
        ) : null}
        <ListItemText primary={itemtext} />
        {itemState.open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={itemState.open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </List>
  );
};

CollapsItem.propTypes = {
  itemtext: PropTypes.string.isRequired
};

export default CollapsItem;
