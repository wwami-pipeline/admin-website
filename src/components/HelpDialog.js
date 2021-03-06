import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
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

export default function HelpDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="inherit" onClick={handleClickOpen}>
        Website Instructions
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Website Instructions
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <b>Adding a sub-project:</b> There is a button to add a location,
            organization, and subproject in their respective layer. Events have
            fields, or information associated with the event. Fields will
            auto-populate when you create an event, though you can delete or add
            new ones through their respective buttons (trash can for delete and
            "Add Field" to add, and "Change Field Ordering" to reorder).{' '}
          </Typography>
          <Typography gutterBottom>
            <b>Adding calendar events:</b> You may add calender events under
            subprojects by clicking the "Set Calendar Dates" button. Here, you
            may specify the time and occurrences of the event.{' '}
            <b>You will set the sign-up link for your sub-project here</b>
          </Typography>
          <Typography gutterBottom>
            <b>Remember to save:</b> To save your changes, you must press the
            "save" button in in the subproject you've edited. You do not need to
            save after uploading an image.
          </Typography>
          <Typography gutterBottom>
            <b>Other:</b> Each location can have an organization called
            "Others". This is a special organization that will contain
            miscellaneous events. To add this to a location, simply add an
            organization titled "Others".
          </Typography>
          <Typography gutterBottom>
            <b>Categories:</b> You can categorize events through the "Category"
            field. This is auto-populated in events under "Others", but can also
            be added to any event. In the sign up website, events with the same
            category will be grouped together under a title of the category's
            name. Categories are case-sensitive.
          </Typography>
          <Typography gutterBottom>
            <b>Managing images:</b> You can set the images for organizations and
            subprojects. Clicking "set image" will ask you to upload a file from
            your computer. This image must be in JPEG format. You can also view
            the image, which will either open the current image in a new tab or
            inform you that no image has been set.{' '}
            <a href="https://picresize.com/">https://picresize.com/</a> can be
            used to to crop images to squares and change the image type to JPG.
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}
