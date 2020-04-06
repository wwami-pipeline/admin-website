import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
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

export default function HelpDialog(props) {
  let currDate = '';

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
                  {rrulestr(props.dates[index]).toText()}
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
          <RRuleGenerator onChange={(rrule) => (currDate = rrule)} />
          <Button variant="contained" onClick={() => props.addDate(currDate)}>
            Add Date Range
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
