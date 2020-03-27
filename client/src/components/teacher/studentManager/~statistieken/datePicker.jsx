import React, { Component } from "react";
// Components
import CustomInputForDatePicker from "./customInput";
import DatePicker from "react-datepicker";
// Material UI
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core/";
// CSS
import "react-datepicker/dist/react-datepicker.css";

const styles = theme => ({
  //   calender: {
  //     overflow: "visible",
  //     zIndex: theme.zIndex.drawer + 9
  //   }
});

class MuiDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      datePickerOpen: false
    };
  }

  handleChangeStart = date => {
    this.setState({ startDate: date });
  };

  handleChangeEnd = date => {
    this.setState({ endDate: date });
  };

  handleDatePickerClick = () => {
    this.setState(state => ({ datePickerOpen: !state.datePickerOpen }));
  };

  render() {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item sm={12} xs={12}>
          <DatePicker
            customInput={
              <CustomInputForDatePicker label="Start datum" />
            }
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
            dateFormat="dd/MM/yyyy"
            popperModifiers={{
              offset: {
                enabled: true,
                offset: "-30px, 10px"
              },
              preventOverflow: {
                enabled: true,
                escapeWithReference: false,
                boundariesElement: "viewport"
              }
            }}
            isClearable={true}
            calendarClassName={this.props.calenderStyles}
          />
        </Grid>
        <Grid item sm={12} xs={12}>
          <DatePicker
            customInput={
              <CustomInputForDatePicker label="Eind datum" />
            }
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
            dateFormat="dd/MM/yyyy"
            popperModifiers={{
              offset: {
                enabled: true,
                offset: "-30px, 10px"
              },
              preventOverflow: {
                enabled: true,
                escapeWithReference: false,
                boundariesElement: "viewport"
              }
            }}
            isClearable={true}
            calendarClassName={this.props.calenderStyles}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(MuiDatePicker);
