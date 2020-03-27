import React from "react";
// Material ui
import { Typography, Box } from "@material-ui/core/";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import { TreeView, TreeItem } from "@material-ui/lab/";
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import LanguageIcon from "@material-ui/icons/Language";
import MovieIcon from "@material-ui/icons/Movie";
// Services
import {
  alfaContentTypes,
  routeUrls,
  alfaContentLevels
} from "services/config";
import { historyService } from "services/history";

const useTreeItemStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
    "&:focus > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)"
    }
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2)
    }
  },
  expanded: {},
  label: {
    fontWeight: "inherit",
    color: "inherit"
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0)
  },
  labelIcon: {
    marginRight: theme.spacing(1)
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1
  }
}));

const StyledTreeItem = withStyles(theme => ({
  iconContainer: {
    "& .close": {
      opacity: 0.3
    }
  },
  group: {
    marginLeft: 12,
    paddingLeft: 12,
    borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`
  }
}))(props => <TreeItem {...props} />);

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 400
  }
});

function StyledMediaTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label
      }}
      {...other}
    />
  );
}

export default props => {
  const { data, expandedItems } = props;
  const classes = useStyles();

  const deepestContent = paragraph => {
    return (
      <>
        {paragraph.content.map(el => (
          <StyledMediaTreeItem
            key={el._id}
            nodeId={el._id}
            labelText={el.type}
            labelIcon={
              el.type === alfaContentTypes.FILMPJE
                ? VideoLibraryIcon
                : el.type === alfaContentTypes.TAALBEAT
                ? LanguageIcon
                : el.type === alfaContentTypes.LIEDJE
                ? AudiotrackIcon
                : MovieIcon
            }
            onClick={() => onNodeToggle(paragraph._id, el.type)}
            //labelInfo={el.items.length}
            color={
              el.type === alfaContentTypes.FILMPJE
                ? "#dd0055"
                : el.type === alfaContentTypes.LIEDJE
                ? "#1a73e8"
                : el.type === alfaContentTypes.TAALBEAT
                ? "#3c8039"
                : "#4ec4a6"
            }
            bgColor={
              el.type === alfaContentTypes.FILMPJE
                ? "#ffedf1"
                : el.type === alfaContentTypes.LIEDJE
                ? "#e8f0fe"
                : el.type === alfaContentTypes.TAALBEAT
                ? "#e6f4ea"
                : "#e5fff8"
            }
          />
        ))}
      </>
    );
  };

  // Render tree items
  const renderTreeItems = items => {
    return items.map((item, i) =>
      item.children && item.children.length ? (
        <StyledTreeItem
          nodeId={item._id}
          label={item.value}
          key={item._id}
          onClick={() => onNodeToggle(item._id, item.depthLevel)}
        >
          {item.paragrafRef && item.content
            ? deepestContent(item)
            : renderTreeItems(item.children)}
        </StyledTreeItem>
      ) : item.paragrafRef && item.content ? (
        <StyledTreeItem
          nodeId={item._id}
          label={item.paragrafRef}
          key={item._id}
          onClick={() =>
            onNodeToggle(item._id, alfaContentLevels.SUB_PARAGRAPH)
          }
        >
          {deepestContent(item)}
        </StyledTreeItem>
      ) : (
        <StyledTreeItem
          nodeId={item._id}
          label={item.paragrafRef}
          key={item._id}
          onClick={() => onNodeToggle(item._id, item.type)}
        />
      )
    );
  };

  function onNodeToggle(nodeId, depth) {
    historyService.push(
      `${routeUrls.teacher.alfaContents}/branch/${nodeId}/depthLevel/${depth}`
    );
  }

  return expandedItems.length ? (
    <Box p={2}>
      <TreeView
        className={classes.root}
        defaultExpanded={expandedItems}
        defaultEndIcon={""}
        defaultCollapseIcon={<FolderOpenIcon />}
        defaultExpandIcon={<FolderIcon />}
      >
        {renderTreeItems(data)}
      </TreeView>
    </Box>
  ) : null;
};
