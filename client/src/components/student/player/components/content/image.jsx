import React from "react";
// Components
import ImagePlayer from "./../players/imagePlayer";
// Services
import { bucketUrl } from "services/config";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";

const ImageContent = (props) => {
  return (
    <ImagePlayer cover={`${bucketUrl}/smaller/${props.image.value}`} />

    // <div ref={containerRef}>
    //   <img
    //     src={`${bucketUrl}/smaller/${props.image.value}`}
    //     className={classes.responsiveImage}
    //     style={{
    //       width: "100%",
    //       height:
    //         (containerSize.width / containerSize.width) * containerSize.height
    //     }}
    //     alt="background for plaatje content"
    //     onLoad={(event) =>
    //       setContainerSize({
    //         width: event.target.width,
    //         height: event.target.height
    //       })
    //     }
    //   />
    // </div>
  );
};

export default ImageContent;
