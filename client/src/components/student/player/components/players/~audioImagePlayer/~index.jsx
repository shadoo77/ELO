import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// Services
import { bucketUrl } from "services/config";
// Material UI
import { withStyles } from "@material-ui/core/styles";

class AudioImagePlayer extends Component {
  state = { progress: 0 };

  componentWillUnmount() {
    // clearTimeout(this.playDelayTimer);
    clearTimeout(this.updateProgressTimer);
  }

  updateProgress() {}

  startAudio() {
    //   this.updateProgressTimer = setTimeout(() => this.updateProgress(), 10);
    // clearTimeout(this.playDelayTimer);
    this.playerElemRef.currentTime = 0;
    this.playerElemRef.play();
  }

  startHoverHandler(event) {
    event.preventDefault();
    this.setState({
      showAudioIcon: true
    });
    // clearTimeout(this.playDelayTimer);
    // if (!this.props.showFeedback) {
    //   this.setState({
    //     showAudioIcon: true
    //   });
    //   this.playDelayTimer = setTimeout(() => this.startAudio(), 400);
    // }
  }

  endHoverHandler(event) {
    event.preventDefault();
    clearTimeout(this.playDelayTimer);
    this.playerElemRef.pause();
    this.playerElemRef.currentTime = 0;
  }

  audioEndHandler(event) {
    event.preventDefault();

    this.playerElemRef.pause();
    this.playerElemRef.currentTime = 0;
    this.setState({ progress: `0%` });
    //   clearTimeout(this.playDelayTimer);
    //    this.playDelayTimer = setTimeout(() => this.startAudio(), 1800); // Herhalen na delay? Zoja, hoelang wachten?
  }

  audioTimeHandler(event) {
    event.preventDefault();
    const totTime = this.playerElemRef.duration;
    const curTime = this.playerElemRef.currentTime;
    const percentage = Math.ceil((curTime / totTime) * 100);
    this.setState({ progress: `${percentage}%` });
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div
          className={classes.container}
          style={{
            width: "100%",
            height: "200px",
            backgroundImage: `url(${this.props.imageUrl})`
          }}
          onClick={(event) => this.startAudio(event)} // Select answer click
          // onMouseEnter={(event) => this.startHoverHandler(event)}
          // onMouseLeave={(event) => this.endHoverHandler(event)}
        >
          <audio
            preload="true"
            ref={(ref) => (this.playerElemRef = ref)}
            onEnded={(event) => this.audioEndHandler(event)}
            onTimeUpdate={(event) => this.audioTimeHandler(event)}
          >
            <source src={this.props.audioUrl} type="audio/mp3" />
          </audio>
          <div
            className={`${classes.transition} ${classes.rolloverImage} ${classes.audioplayerImage}`}
            style={{
              backgroundImage: `url(${bucketUrl}/smaller/audio_playing.png)`
            }}
          >
            <div
              className={classes.bar}
              id="audioProgressbar"
              style={{
                width: this.state.progress,
                height: 12,
                backgroundColor: "red"
              }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { slide } = state.slideshow.active;
  return {
    active: { slide }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const styles = {
  container: {
    position: "relative",
    height: "100px",
    width: "100px"
  },
  rolloverImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain, cover",
    backgroundPosition: "center"
  },
  audioplayerImage: {
    backgroundColor: "rgba(255,0,0,0.0)",
    opacity: 0,
    "&:hover": {
      opacity: 1
    }
  },
  feedbackImage: {
    backgroundColor: "rgba(255,255,255,0.0)"
  },
  transition: {
    transition: "opacity 300ms",
    webkitTransition: "opacity 300ms",
    transitionTimingFunction: "ease-in-out"
  },
  bar: {
    height: 12,
    backgroundColor: "rgba(235, 77, 128, 1)",
    transition: "width 100ms"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AudioImagePlayer));
