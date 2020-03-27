import React, { Suspense, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// Services
import { alfaContentLevels } from "services/config";
import { backendService } from "services/backend";
// Data
import { useResource, NetworkErrorBoundary } from "rest-hooks";
// Shapes
import ContentResource from "shapes/content.shape";
// Components
import GroupContainer from "../../shared/group/Container";
import TreeView from "./TreeView";
import Spinner from "components/shared/spinner/";
import Warner from "components/shared/warner/";
import Sidebar from "components/shared/sidebar/test";
import ThemesList from "./Themes";
import ParagraphsList from "./Paragraphs";
import ParagraphContent from "./ParagraphContent";
import GalleryOfParagraph from "./GalleryOfParagraph";
import Category from "./Category";
import BreadCrumb from "./BreadCrumb";
import ContentContainer from "./content/";
import ContentOfParagraph from "./content/ParaContent";
// Utils
import {
  makeTreeViewData,
  getItemFromTree,
  getPathOfTreeItem,
  createBreadcrumbData
} from "./utils";

// Material UI
import { Icon, Box, Tooltip } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles(theme => ({
  sideBarArea: {
    position: "relative",
    height: "100%",
    borderRight: "1px solid #ccc",
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  pullIconContainer: {
    zIndex: theme.zIndex.sideBarArea + 10,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    msTransform: "translateY(-50%)",
    right: -25,
    overflow: "hidden"
  },
  pullIcon: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: theme.palette.secondary.main,
    padding: 10,
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  verticalMenuTitle: {
    position: "relative",
    minHeight: "100vh",
    height: "100%",
    width: "100%",
    color: "#fff",
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  verticalMenuTitleText: {
    position: "absolute",
    top: "62%",
    left: "25%",
    transform: "rotate(-90deg)",
    whiteSpace: "nowrap",
    transformOrigin: "0 0",
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  }
}));

function ErrorPage({ error }) {
  const errormsg = `ALFA CONTENTS INDEX ERROR : ${error.status} - ${error.response}, ${error.response.statusText}`;
  return <Warner message={errormsg} />;
}

// Here is the index function
export default props => {
  const { branchId, depthLevel } = props.match.params;
  const [open, setOpen] = useState(true);
  const [publicationId, setBublicationId] = useState("");
  const classes = useStyle();
  const alfaContent = useResource(ContentResource.detailShape(), {});
  const treeViewData = alfaContent ? makeTreeViewData(alfaContent) : [];
  const rootTree = {
    _id: publicationId,
    path: publicationId,
    value: "Home",
    depthLevel: alfaContentLevels.PUBLICATION,
    children: treeViewData
  };

  const getAlfaRoot = async () => {
    try {
      const alfa = await backendService.getAlfaRoot();
      setBublicationId(alfa._id);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAlfaRoot();
  }, []);

  const expandedItems = getPathOfTreeItem(rootTree, branchId, depthLevel);
  const breadcrumbData = createBreadcrumbData(expandedItems, rootTree);

  const onToggle = () => {
    setOpen(!open);
  };

  function getParagraphsByThemeId(themeId, themes) {
    const theme = themes.find(el => el._id === themeId);
    return theme.children || [];
  }

  const renderContents = data => {
    switch (depthLevel) {
      case alfaContentLevels.PUBLICATION:
        return <ThemesList themes={data.themes} />;
      case alfaContentLevels.THEME:
        const paragraphs = getParagraphsByThemeId(branchId, data.themes);
        return <ParagraphsList paragraphs={paragraphs} />;
      case alfaContentLevels.PARAGRAPH:
        const paragraph = getItemFromTree(rootTree, branchId);
        return <ParagraphContent paragraphContent={paragraph.children} />;
      case alfaContentLevels.SUB_PARAGRAPH:
        const para = getItemFromTree(rootTree, branchId);
        return <GalleryOfParagraph paragraph={para} />;
      case alfaContentLevels.FILMPJE:
      case alfaContentLevels.TAALBEAT:
      case alfaContentLevels.LIEDJE:
      case alfaContentLevels.AUDIO_FRAGMENT:
        const paraCat = getItemFromTree(rootTree, branchId);
        const category = paraCat.content.find(el => el.type === depthLevel);
        return <Category category={category} paragraph={paraCat.paragrafRef} />;
      case alfaContentLevels.VIDEO_CATEGORY:
        const vidContent = rootTree.children.find(
          el => el._id === "CONTENT_FILMPJES"
        );
        return <ContentContainer content={vidContent} />;
      case alfaContentLevels.TAALBEAT_CATEGORY:
        const taalbeatContent = rootTree.children.find(
          el => el._id === "CONTENT_TAALBEATS"
        );
        return <ContentContainer content={taalbeatContent} />;
      case alfaContentLevels.LIEDJE_CATEGORY:
        const liedContent = rootTree.children.find(
          el => el._id === "CONTENT_LIEDJES"
        );
        return <ContentContainer content={liedContent} />;
      case alfaContentLevels.AUDIOFRAGMENT_CATEGORY:
        const audFrContent = rootTree.children.find(
          el => el._id === "CONTENT_AUDIOFRAGMENTEN"
        );
        return <ContentContainer content={audFrContent} />;
      case alfaContentLevels.PAR_VID_CATEGORY:
      case alfaContentLevels.PAR_TAALBEAT_CATEGORY:
      case alfaContentLevels.PAR_LIEDJE_CATEGORY:
      case alfaContentLevels.PAR_AUDFR_CATEGORY:
        const [paraId, contType] = branchId.split("-");
        const paragraphCat = getItemFromTree(rootTree, paraId);
        const contentOfPar = paragraphCat.content.find(
          el => el.type === contType
        );
        return (
          <ContentOfParagraph
            content={contentOfPar}
            paragraph={paragraphCat.paragrafRef}
          />
        );
      default:
        return <Redirect to="/404" />;
    }
  };

  return (
    <GroupContainer
      title="Alfa's Inhuid"
      subtitle={<BreadCrumb data={breadcrumbData} />}
    >
      <Suspense fallback={<Spinner />}>
        <NetworkErrorBoundary fallbackComponent={ErrorPage}>
          <Box display="flex" flexWrap="wrap" justifyContent="center">
            <Box className={classes.sideBarArea} width={open ? "20%" : "1.5em"}>
              {open ? (
                <Sidebar>
                  <TreeView
                    data={treeViewData}
                    itemType="tree"
                    treeName="Alfa"
                    expandedItems={expandedItems}
                  />
                </Sidebar>
              ) : (
                <div className={classes.verticalMenuTitle}>
                  {/* <div className={classes.test} /> */}
                  <div className={classes.verticalMenuTitleText} />
                  {/* Boom structuur
              </div> */}
                </div>
              )}
              <div className={classes.pullIconContainer}>
                <Tooltip title={!open ? "Menu open" : "Menu dicht doen"}>
                  <Icon className={classes.pullIcon} onClick={onToggle}>
                    {!open ? "keyboard_arrow_right" : "keyboard_arrow_left"}
                  </Icon>
                </Tooltip>
              </div>
            </Box>
            <Box flexGrow={1}>
              <Switch>
                <Route
                  exact
                  render={() =>
                    alfaContent && <div>{renderContents(alfaContent)}</div>
                  }
                />
              </Switch>
            </Box>
          </Box>
        </NetworkErrorBoundary>
      </Suspense>
    </GroupContainer>
  );
};
