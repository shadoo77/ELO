import React, { Component } from "react";
import PropTypes from "prop-types";
import { hot } from "react-hot-loader";
// Components
import ReactPlayer from "./ReactPlayer";
// CSS
import "./styles.css";
class VimeoPlayer extends Component {
  state = {
    url: "",
    pip: false,
    playing: false,
    controls: false,
    volume: 0.1,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 100,
    loop: false
  };

  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
      pip: false
    });
  };

  playPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  stop = () => {
    this.setState({
      url: null,
      playing: false
    });
  };

  // toggleControls = () => {
  //   const url = this.state.url;
  //   this.setState(
  //     {
  //       controls: !this.state.controls,
  //       url: null
  //     },
  //     () => this.load(url)
  //   );
  // };

  toggleLoop = () => {
    this.setState({ loop: !this.state.loop });
  };

  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) });
  };

  toggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  };

  setPlaybackRate = e => {
    this.setState({
      playbackRate: parseInt(e.target.value)
    });
  };
  togglePIP = () => {
    this.setState({ pip: !this.state.pip });
  };

  onPlay = () => {
    this.setState({ playing: true });
  };

  onEnablePIP = () => {
    this.setState({ pip: true });
  };

  onDisablePIP = () => {
    this.setState({ pip: false });
  };

  onPause = () => {
    this.setState({ playing: false });
  };

  onSeekMouseDown = e => {
    this.setState({ seeking: true });
  };

  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) });
  };

  onSeekMouseUp = e => {
    this.setState({ seeking: false });
    this.player.seekTo(parseFloat(e.target.value));
  };

  onProgress = state => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state);
    }
  };

  onEnded = () => {
    this.setState({ playing: this.state.loop });
  };

  onClickFullscreen = () => {
    this.setState({ fullScreen: true });
  };

  onDuration = duration => {
    this.setState({ duration });
  };

  ref = player => {
    this.player = player;
  };

  somename = rate => {
    this.setState({ playbackRate: rate });
  };

  render() {
    const {
      controls,
      volume,
      muted,
      loop,
      playbackRate
    } = this.state;

    return (
      <div
        className="player-wrapper"
        style={{
          width: this.props.size.width,
          height: this.props.size.height
        }}
      >
        <ReactPlayer
          ref={this.ref}
          className="react-player"
          width={this.props.size.width}
          height={this.props.size.height}
          url={this.props.url}
          playing={this.state.playing}
          controls={controls}
          loop={loop}
          playbackRate={playbackRate}
          volume={volume}
          muted={muted}
          onReady={() => console.log("onReady")}
          onStart={() => console.log("onStart")}
          onPlay={this.onPlay}
          onEnablePIP={this.onEnablePIP}
          onDisablePIP={this.onDisablePIP}
          onPause={this.onPause}
          onBuffer={() => console.log("onBuffer")}
          onSeek={e => console.log("onSeek", e)}
          onEnded={this.onEnded}
          onError={e => console.log("onError", e)}
          onProgress={this.onProgress}
          onDuration={this.onDuration}
          somename={this.onPlaybackRateChange}
        />

        <div className="extraControls">
          <input
            type="range"
            min={50}
            max={200}
            step="1"
            value={playbackRate}
            onChange={this.setPlaybackRate}
            onMouseUp={this.setPlaybackRate}
          />
        </div>
      </div>
    );
  }
}

VimeoPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  size: PropTypes.object.isRequired
};

export default hot(module)(VimeoPlayer);
