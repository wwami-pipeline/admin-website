import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { Divider } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import { RRule, rrulestr } from 'rrule';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = () => ({
  dialogContent: {
    height: 500,
  },
  dialogBorder: {
    height: '20px',
  },
  title: {
    marginBottom: '.5em',
  },
});

const validTime = (time) => {
  if (time.includes(':')) {
    const hour = time.split(':')[0];
    const minute = time.split(':')[1];
    return (
      !isNaN(hour) &&
      !isNaN(minute) &&
      parseInt(hour) > 0 &&
      parseInt(minute) >= 0 &&
      parseInt(minute) < 60
    );
  }
  return false;
};

class DateDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      startTime: new Date(),
      endDate: new Date(),
      weekInterval: 1,
      duration: '1:00',
      link: '',
      repeat: 'never',
      mChecked: false,
      tuChecked: false,
      wChecked: false,
      thChecked: false,
      fChecked: false,
      saChecked: false,
      suChecked: false,
    };
  }

  render() {
    const { classes, dates, removeDate, addDate } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          fullWidth
        >
          <div className={classes.dialogBorder} />
          <DialogTitle>
            <Typography variant="h4" className={classes.textCaps}>
              Calendar Events
            </Typography>
          </DialogTitle>
          <div className={classes.dialogBody}>
            <DialogContent className={classes.dialogContent}>
              {/* Display current dates set from props */}
              <Typography variant="h6">Current Calendar Events</Typography>
              {dates ? (
                Object.keys(dates).map((index) => (
                  <div>
                    <IconButton
                      style={{ display: 'inline-block' }}
                      onClick={() => removeDate(dates[index])}
                    >
                      <Delete />
                    </IconButton>
                    <Typography style={{ display: 'inline-block' }}>
                      {dates[index].neverRepeat
                        ? 'once on ' +
                          new Date(rrulestr(dates[index].rrule).all()[0])
                            .toISOString()
                            .slice(0, 10)
                        : rrulestr(dates[index].rrule).toText()}
                      {dates[index].startTime
                        ? ', start time: ' + dates[index].startTime
                        : ''}
                      , {'duration: ' + dates[index].duration},{' '}
                      {'sign-up link: ' +
                        (!dates[index].link || dates[index].link === ''
                          ? 'none'
                          : dates[index].link)}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography>
                  <i>This event has no calendar dates. Add one below.</i>
                </Typography>
              )}

              <Divider />

              {/* Section to add new calendar events */}

              <div style={{ marginTop: '1em' }}>
                <Typography variant="h6" gutterBottom>
                  Add a new calendar event
                </Typography>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-around">
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Start Date"
                      value={this.state.startDate}
                      onChange={(val) => this.setState({ startDate: val })}
                      KeyboardButtonProps={{
                        'aria-label': 'change start date',
                      }}
                    />
                    <KeyboardTimePicker
                      margin="normal"
                      variant="inline"
                      id="time-picker"
                      label="Start Time"
                      value={this.state.startTime}
                      onChange={(val) => this.setState({ startTime: val })}
                      KeyboardButtonProps={{
                        'aria-label': 'change start time',
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>

                <div style={{ marginTop: '1em', marginBottom: '1em' }}>
                  {/* Duration */}
                  <TextField
                    id="time"
                    label="Duration (HH:MM)"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.duration}
                    onChange={(val) =>
                      this.setState({ duration: val.target.value })
                    }
                    style={{ marginLeft: '1em' }}
                  />
                  {/* Duration */}
                  <TextField
                    label="Sign-Up Link"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.link}
                    onChange={(val) =>
                      this.setState({ link: val.target.value })
                    }
                    style={{ marginLeft: '1em' }}
                  />

                  <FormControl
                    className={classes.formControl}
                    style={{ marginLeft: '1em' }}
                  >
                    <InputLabel id="repeat-input-label">Repeat</InputLabel>
                    <Select
                      labelId="repeat-select-label"
                      id="repeat-select"
                      value={this.state.repeat}
                      onChange={(e) =>
                        this.setState({ repeat: e.target.value })
                      }
                    >
                      <MenuItem value={'never'}>Never</MenuItem>
                      <MenuItem value={'daily'}>Daily</MenuItem>
                      <MenuItem value={'weekly'}>Weekly</MenuItem>
                      <MenuItem value={'monthly'}>Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              {this.state.repeat !== 'never' ? (
                <div>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Repeat Until"
                        value={this.state.endDate}
                        onChange={(val) => this.setState({ endDate: val })}
                        KeyboardButtonProps={{
                          'aria-label': 'change end date',
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>

                  {this.state.repeat === 'weekly' ? (
                    <div>
                      <div>
                        <div style={{ display: 'inline-block' }}>
                          <Typography>
                            <b> Week Interval </b>
                          </Typography>
                          <Typography>
                            <i>(Ex: 2 would repeat every 2 weeks)</i>
                          </Typography>
                        </div>
                        <div
                          style={{ display: 'inline-block', marginLeft: '1em' }}
                        >
                          <input
                            type="number"
                            style={{ width: 50 }}
                            value={this.state.weekInterval}
                            onChange={(evt) => {
                              if (evt.target.value > 0) {
                                this.setState({
                                  weekInterval: evt.target.value,
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ marginTop: '1em', marginBottom: 5 }}>
                        <Typography>
                          <b>Repeat on</b>
                        </Typography>
                        <Typography>
                          <i>
                            Leave empty if you do not want to base repeat off of
                            day of week
                          </i>
                        </Typography>
                      </div>
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.mChecked}
                              onChange={() =>
                                this.setState({
                                  mChecked: !this.state.mChecked,
                                })
                              }
                              name="mondayCheckbox"
                            />
                          }
                          label="M"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.tuChecked}
                              onChange={() =>
                                this.setState({
                                  tuChecked: !this.state.tuChecked,
                                })
                              }
                              name="mondayCheckbox"
                            />
                          }
                          label="Tu"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.wChecked}
                              onChange={() =>
                                this.setState({
                                  wChecked: !this.state.wChecked,
                                })
                              }
                              name="wCheckbox"
                            />
                          }
                          label="W"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.thChecked}
                              onChange={() =>
                                this.setState({
                                  thChecked: !this.state.thChecked,
                                })
                              }
                              name="thCheckbox"
                            />
                          }
                          label="Th"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.fChecked}
                              onChange={() =>
                                this.setState({
                                  fChecked: !this.state.fChecked,
                                })
                              }
                              name="fCheckbox"
                            />
                          }
                          label="F"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.saChecked}
                              onChange={() =>
                                this.setState({
                                  saChecked: !this.state.saChecked,
                                })
                              }
                              name="saCheckbox"
                            />
                          }
                          label="Sa"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.suChecked}
                              onChange={() =>
                                this.setState({
                                  suChecked: !this.state.suChecked,
                                })
                              }
                              name="suCheckbox"
                            />
                          }
                          label="Su"
                        />
                      </FormGroup>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              ) : (
                <div />
              )}

              <Button
                variant="contained"
                onClick={() => {
                  if (validTime(this.state.duration)) {
                    // Get array of repeat days for weekly
                    let repeatDays = [];
                    if (this.state.mChecked) repeatDays.push(RRule.MO);
                    if (this.state.tuChecked) repeatDays.push(RRule.TU);
                    if (this.state.wChecked) repeatDays.push(RRule.WE);
                    if (this.state.tuChecked) repeatDays.push(RRule.TH);
                    if (this.state.fChecked) repeatDays.push(RRule.FR);
                    if (this.state.saChecked) repeatDays.push(RRule.SA);
                    if (this.state.suChecked) repeatDays.push(RRule.SU);

                    addDate(
                      this.state.startDate,
                      this.state.startTime,
                      this.state.duration,
                      this.state.endDate,
                      this.state.link,
                      this.state.repeat,
                      repeatDays,
                      this.state.weekInterval
                    );
                  } else {
                    alert('Invalid duration. Format: HH:MM');
                  }
                }}
              >
                Add Calendar Event
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.props.handleClose} variant="outlined">
                Close
              </Button>
            </DialogActions>
          </div>
          <div className={classes.dialogBorder} />
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(DateDialog);
