import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core/";

class CustomInputForDatePicker extends Component {
  render() {
    return (
      <TextField
        helperText={this.props.helperText}
        value={this.props.value}
        name="datepicker"
        label={this.props.label}
        onClick={this.props.onClick}
        onChange={this.props.onChange}
        margin="dense"
        style={{ marginTop: 35 }}
        fullWidth
      />
    );
  }
}

CustomInputForDatePicker.propTypes = {
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  label: PropTypes.string,
  helperText: PropTypes.string,
  value: PropTypes.string
};

export default CustomInputForDatePicker;
