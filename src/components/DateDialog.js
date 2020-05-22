import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import RRuleGenerator from 'react-rrule-generator';
import { rrulestr } from 'rrule';
import 'bootstrap/dist/css/bootstrap.css'; // this lib uses boostrap (v. 4.0.0-beta.2)
import 'react-rrule-generator/build/styles.css'; // react-rrule-generator's custom CSS
import { Divider } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

const styles = (theme) => ({
  root: {
    minWidth: 500,
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

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

export default function HelpDialog(props) {
  let currDate = 'RRULE:FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1';
  let startTime = '08:00';
  let duration = '2:00';

  return (
    <div>
      <Dialog
        onClose={props.handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.open}
        maxWidth="md"
      >
        <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
          Set Times
        </DialogTitle>

        <DialogContent dividers>
          {/* Display current dates set from props */}
          <Typography variant="h6">Current Times</Typography>
          {props.dates ? (
            Object.keys(props.dates).map((index) => (
              <div>
                <IconButton
                  style={{ display: 'inline-block' }}
                  onClick={() => props.removeDate(props.dates[index])}
                >
                  <Delete />
                </IconButton>
                <Typography style={{ display: 'inline-block' }}>
                  {rrulestr(props.dates[index].rrule).toText()},{' '}
                  {'start time: ' + props.dates[index].startTime},{' '}
                  {'duration: ' + props.dates[index].duration}
                </Typography>
              </div>
            ))
          ) : (
            <Typography>
              <i>This event has no calendar dates. Add one below.</i>
            </Typography>
          )}

          <Divider />

          {/* RRULE Generator and add button */}
          <div>
            <RRuleGenerator
              config={{ repeat: ['Monthly', 'Weekly', 'Daily'] }}
              onChange={(rrule) => (currDate = rrule)}
            />
          </div>

          {/* Time Picker */}
          <div style={{ marginTop: '1em', marginBottom: '2em' }}>
            <TextField
              id="time"
              label="Start time"
              type="time"
              defaultValue="08:00"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              onChange={(val) => {
                startTime = val.target.value;
              }}
            />
            {/* Duration */}
            <TextField
              id="time"
              label="Duration (HH:MM)"
              defaultValue="2:00"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(val) => (duration = val.target.value)}
              style={{ marginLeft: '1em' }}
            />
          </div>

          <Button
            variant="contained"
            onClick={() => {
              if (validTime(duration)) {
                props.addDate(currDate, startTime, duration);
              } else {
                alert('Invalid duration. Format: HH:MM');
              }
            }}
          >
            Add Date Range
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
