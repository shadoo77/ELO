import React from "react";
import { withRouter } from "react-router-dom";
// Components
import PublicationBrowser from "./publication";
import ThemeBrowser from "./node";
import ParagraphBrowser from "./~paragraph";
// Services
import { tagLevels } from "services/config";

const SlideshowBrowser = (props) => {
  const depthLevel = props.match.params.depthLevel;
  const parentId =
    typeof props.match.params.parentId === "undefined" &&
    depthLevel === tagLevels.PUBLICATION
      ? "5ce26f814d65de88b425f250"
      : props.match.params.parentId;

  const pickBrowser = (depthLevel) => {
    switch (depthLevel.toUpperCase()) {
      case tagLevels.PUBLICATION:
        return <PublicationBrowser parentId={parentId} />;
      case tagLevels.THEME:
        return <ThemeBrowser parentId={parentId} />;
      case tagLevels.PARAGRAPH:
        return <ParagraphBrowser parentId={parentId} />;
      default:
        return null;
    }
  };

  return <>{pickBrowser(depthLevel)}</>;
};

export default withRouter(SlideshowBrowser);
