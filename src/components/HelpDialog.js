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
            <b>OVERVIEWS:</b> You can specify custom overviews for a specific
            organization here. Overviews are optional - to associate an overview
            with an organization, the overview and the organization must have
            the same name.
          </Typography>
          <Typography gutterBottom>
            <b>PREREQUISITES:</b> You can modify the prerequisites for each of
            the four user types. You are able to add title, paragraphs, and
            italics - they will show up on the website as their name suggests.
          </Typography>
          <Typography gutterBottom>
            <b>STRUCTURE:</b> The website is categorized into three layers:
            Locations, Organizations, and Events. There is also a section for
            overviews of each organization. Click on a section to expand it and
            reveal its child elements.
          </Typography>
          <Typography gutterBottom>
            <b>ADD:</b> There is a button to add a location, organization, and
            event in their respective layer. Events have fields, or information
            associated with the event. Fields will auto-populate when you create
            an event, though you can delete or add new ones through their
            respecitve buttons (trash can for delete and "Add Field" to add).
          </Typography>
          <Typography gutterBottom>
            <b>SAVE:</b> To save your changes, press the "save" button in your
            respective category. Specifically, the save button will be located
            after each event or overview.
          </Typography>
          <Typography gutterBottom>
            <b>OTHER:</b> Each location can have an organization called
            "Others". This is a special organization that will contain
            miscellaneous events. To add this category to a location, simply add
            an organization titled "Others" (without the quotation marks, with a
            capital O). Other events will auto-populate different fields than
            normal.
          </Typography>
          <Typography gutterBottom>
            <b>CATEGORY:</b> You can categorize events through the "Category"
            field. This is auto-populated in events under "Others", but can also
            be added to any event. In the sign up website, events with the same
            category will be grouped together under a title of the category's
            name. Note that category name and field are both case-sensitive.
          </Typography>
          <Typography gutterBottom>
            <b>IMAGES:</b> You can set the images for organizations and events.
            Clicking "set image" will ask you to upload a file from your
            computer. This image must be in JPEG format. You can also view the
            image, which will either open the current image in a new tab or
            inform you that no image has been set.{' '}
            <a href="https://picresize.com/">https://picresize.com/</a> can be
            used to to crop images to squares and change the image type to JPG.
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}
