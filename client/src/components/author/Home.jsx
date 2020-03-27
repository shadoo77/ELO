import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { delete_from_tree } from "../../store/actions/tree";

// Components
import Warner from "../shared/warner";
import ConfirmDialog from "../shared/dialog/";
// Material Ui components
import {
  Grid,
  CircularProgress,
  Card,
  CardHeader,
  CardActions,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Icon,
  Fab,
  Slide
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { authorHomePage } from "../shared/Theme";

const useStyle = makeStyles(authorHomePage);

// Helpers functions
function spinner() {
  return (
    <ListItem>
      <CircularProgress />
    </ListItem>
  );
}

function emptyRow() {
  return (
    <ListItem>
      <ListItemText
        primary="Er zijn geen thema's in ons database!"
        secondary="U kunt thema's toevoegen bij klikken op de knop onder"
      />
    </ListItem>
  );
}

function warner(message) {
  return (
    <ListItem>
      <Warner message={message} />
    </ListItem>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
/// ooooooooooooooooooooooooooooooooooo ///

// Function component
const HomePage = props => {
  const { isLoading, hasFailed, tree, message } = props;

  const [dialog, setDialog] = useState({
    themaId: "",
    themaValue: "",
    open: false
  });

  const classes = useStyle();

  // Delete thema
  const deleteThema = () => {
    props.delete_from_tree(dialog.themaId);
    setDialog({
      ...dialog,
      open: false
    });
    //const newTree = deleteFromTree(myTree, themaId, "5ce26f814d65de88b425f250");
    //setMyTree(newTree);
  };

  // Dialog handle open
  const handleOpenDialog = (themaId, themaValue) => {
    setDialog({
      themaId,
      themaValue,
      open: true
    });
  };

  // Dialog handle close
  const handleCloseDialog = () => {
    setDialog({
      ...dialog,
      open: false
    });
  };

  const renderThemas = data => {
    const alfa = "5ce26f814d65de88b425f250";
    return data.map((el, i) =>
      el.parent === alfa ? (
        <React.Fragment key={el._id}>
          <ListItem button>
            <ListItemText
              primary={el.value}
              secondary={el.icon + " >>>>>>>> " + message}
            />
            <ListItemSecondaryAction>
              {/* Edit thema     &&&&&&&&&&&&&&&&&&&&&&   */}
              <Link to={"#"} style={{ textDecoration: "none" }}>
                <IconButton aria-label="Edit" className={classes.iconsButton}>
                  <Tooltip title="Wijzigen">
                    <Icon>edit</Icon>
                  </Tooltip>
                </IconButton>
              </Link>

              {/* Delete thema     &&&&&&&&&&&&&&&&&&&&&&   */}
              <IconButton
                aria-label="Active"
                className={classes.iconsButton}
                onClick={() => handleOpenDialog(el._id, el.value)}
              >
                <Tooltip
                  title="verwijder thema"
                  className={classes.unactiveIcon}
                >
                  <Icon>delete</Icon>
                </Tooltip>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          {i === data.length - 1 ? null : <Divider />}
        </React.Fragment>
      ) : null
    );
  };

  return (
    <React.Fragment>
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
        style={{
          marginTop: "30px",
          padding: "30px"
        }}
      >
        <h2>Hallo {props.authorName}</h2>
        <Grid item xs={12} sm={12}>
          <Card style={{ padding: 12 }}>
            <CardHeader
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              title="Alfa boek's inhoud :"
            />
            <Divider />
            <ConfirmDialog
              transition={Transition}
              dialogOpen={dialog.open}
              dialogTitle="Weet u zeker dat u dit thema wilt verwijderen ?"
              dialogContent={`U gaat thema ${
                dialog.themaValue
              } verwijderen, weet u zeker ?`}
              implementConfirmState={deleteThema}
              handleCloseDialog={handleCloseDialog}
            />
            <List>
              {isLoading
                ? spinner()
                : !isLoading && hasFailed
                ? warner(message)
                : !isLoading && !hasFailed && !tree.children
                ? emptyRow()
                : renderThemas(tree.children || [])}
            </List>
            {/* {confirmDialog} */}
            <CardActions>
              <Link to="/author/new-thema" style={{ textDecoration: "none" }}>
                <Tooltip title="Voeg een nieuwe thema toe">
                  <Fab className={classes.addButton} size="small">
                    <Icon>person_add</Icon>
                  </Fab>
                </Tooltip>
              </Link>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

HomePage.propTypes = {
  delete_from_tree: PropTypes.func.isRequired,
  tree: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasFailed: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  const { isLoading, hasFailed, currentParent, tree, message } = state.tree;
  return {
    isLoading,
    hasFailed,
    currentParent,
    tree,
    message
  };
};

export default connect(
  mapStateToProps,
  { delete_from_tree }
)(HomePage);
